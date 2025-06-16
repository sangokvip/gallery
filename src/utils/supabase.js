import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端实例
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('环境变量缺失：', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('缺少 Supabase 环境变量配置')
}

console.log('Initializing Supabase client with URL:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 消息相关的数据库操作
export const messagesApi = {
  // 获取所有消息
  async getMessages() {
    console.log('正在获取消息列表...');
    try {
      // 首先获取所有消息
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          text,
          original_text,
          user_id,
          created_at,
          is_pinned
        `)
        .order('created_at', { ascending: false }); // 先按时间排序，后面会重新排序

      if (messagesError) {
        console.error('获取消息失败:', messagesError);
        throw messagesError;
      }

      if (!messages) {
        console.log('没有找到任何消息');
        return [];
      }

      console.log('成功获取原始消息:', messages.length, '条');

      // 获取每条消息的反应数据
      const messagesWithReactions = await Promise.all(
        messages.map(async (message) => {
          try {
            // 获取点赞数
            const { data: likes, error: likesError } = await supabase
              .from('message_reactions')
              .select('id')
              .eq('message_id', message.id)
              .eq('is_like', true);

            if (likesError) {
              console.error(`获取消息 ${message.id} 的点赞数失败:`, likesError);
              return {
                ...message,
                reactions: { likes: 0, dislikes: 0 },
                reply_count: 0
              };
            }

            // 获取点踩数
            const { data: dislikes, error: dislikesError } = await supabase
              .from('message_reactions')
              .select('id')
              .eq('message_id', message.id)
              .eq('is_like', false);

            if (dislikesError) {
              console.error(`获取消息 ${message.id} 的点踩数失败:`, dislikesError);
              return {
                ...message,
                reactions: { likes: 0, dislikes: 0 },
                reply_count: 0
              };
            }

            // 获取回复数量
            const { data: replies, error: repliesError } = await supabase
              .from('message_replies')
              .select('id')
              .eq('message_id', message.id);

            if (repliesError) {
              console.error(`获取消息 ${message.id} 的回复数失败:`, repliesError);
              return {
                ...message,
                reactions: {
                  likes: likes?.length || 0,
                  dislikes: dislikes?.length || 0
                },
                reply_count: 0
              };
            }

            return {
              ...message,
              reactions: {
                likes: likes?.length || 0,
                dislikes: dislikes?.length || 0
              },
              reply_count: replies?.length || 0
            };
          } catch (error) {
            console.error(`处理消息 ${message.id} 的数据时出错:`, error);
            // 如果获取反应失败，返回原始消息，但反应数为0
            return {
              ...message,
              reactions: {
                likes: 0,
                dislikes: 0
              },
              reply_count: 0
            };
          }
        })
      );

      console.log('成功获取所有消息的反应数据');

      // 按优先级排序：
      // 1. 管理员消息
      // 2. 置顶消息
      // 3. 点赞数
      // 4. 创建时间
      const sortedMessages = messagesWithReactions.sort((a, b) => {
        // 管理员消息始终最优先
        if (a.user_id === 'admin' && b.user_id !== 'admin') return -1;
        if (a.user_id !== 'admin' && b.user_id === 'admin') return 1;
        
        // 如果都是管理员消息，按时间排序
        if (a.user_id === 'admin' && b.user_id === 'admin') {
          return new Date(b.created_at) - new Date(a.created_at);
        }

        // 非管理员消息，先比较置顶状态
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        // 如果置顶状态相同，比较点赞数
        const aLikes = a.reactions?.likes || 0;
        const bLikes = b.reactions?.likes || 0;
        if (aLikes !== bLikes) return bLikes - aLikes;

        // 最后按时间排序
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      console.log(`成功获取并排序 ${sortedMessages.length} 条消息`);
      return sortedMessages;
    } catch (error) {
      console.error('获取消息时发生错误:', error);
      throw new Error('获取消息失败: ' + (error.message || '未知错误'));
    }
  },

  // 获取热门消息（点赞数最多的前3条）
  async getTopMessages() {
    console.log('正在获取热门消息...');
    try {
      // 首先获取所有消息
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*');

      if (messagesError) {
        console.error('获取热门消息失败:', messagesError);
        throw messagesError;
      }

      // 获取每条消息的反应数据
      const messagesWithReactions = await Promise.all(
        messages.map(async (message) => {
          // 获取点赞数
          const { data: likes, error: likesError } = await supabase
            .from('message_reactions')
            .select('id')
            .eq('message_id', message.id)
            .eq('is_like', true);

          // 获取点踩数
          const { data: dislikes, error: dislikesError } = await supabase
            .from('message_reactions')
            .select('id')
            .eq('message_id', message.id)
            .eq('is_like', false);

          if (likesError) console.error('获取点赞数失败:', likesError);
          if (dislikesError) console.error('获取点踩数失败:', dislikesError);

          return {
            ...message,
            likes: likes?.length || 0,
            dislikes: dislikes?.length || 0
          };
        })
      );

      // 按点赞数排序并返回前3条
      const topMessages = messagesWithReactions
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 3);

      console.log('成功获取热门消息:', topMessages);
      return topMessages;
    } catch (error) {
      console.error('获取热门消息时发生错误:', error);
      throw new Error('获取热门消息失败: ' + (error.message || '未知错误'));
    }
  },

  // 检查用户24小时内的反应次数
  async checkUserReactionLimit(userId) {
    console.log('正在检查用户24小时内的反应次数:', userId);
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { count, error } = await supabase
        .from('message_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', twentyFourHoursAgo);

      if (error) {
        console.error('检查反应次数失败:', error);
        throw error;
      }

      console.log('用户24小时内的反应次数:', count);
      return count || 0;
    } catch (error) {
      console.error('检查反应次数时发生错误:', error);
      throw new Error('检查反应次数失败: ' + (error.message || '未知错误'));
    }
  },

  // 添加反应（点赞/踩）
  async addReaction(messageId, userId, isLike) {
    console.log('正在添加反应:', { messageId, userId, isLike });
    try {
      // 首先检查用户24小时内的反应次数
      const reactionCount = await this.checkUserReactionLimit(userId);
      if (reactionCount >= 50) {
        throw new Error('您在24小时内的点赞/点踩次数已达到上限(50次)');
      }

      // 添加新的反应
      const { error: insertError } = await supabase
        .from('message_reactions')
        .insert([{
          message_id: messageId,
          user_id: userId,
          is_like: isLike,
          created_at: new Date().toISOString() // 添加创建时间
        }]);

      if (insertError) throw insertError;
      return { action: 'added' };
    } catch (error) {
      console.error('添加反应时发生错误:', error);
      throw new Error(error.message || '添加反应失败: 未知错误');
    }
  },

  // 获取消息的反应统计
  async getMessageReactions(messageId) {
    console.log('正在获取消息反应统计:', messageId);
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .select('is_like')
        .eq('message_id', messageId);

      if (error) {
        console.error('获取反应统计失败:', error);
        throw error;
      }

      // 直接计算总数，不考虑用户重复
      const likes = data.filter(r => r.is_like).length;
      const dislikes = data.filter(r => !r.is_like).length;

      return { 
        likes, 
        dislikes,
        total: likes + dislikes // 添加总数统计
      };
    } catch (error) {
      console.error('获取反应统计时发生错误:', error);
      throw new Error('获取反应统计失败: ' + (error.message || '未知错误'));
    }
  },

  // 检查是否存在重复消息
  async checkDuplicateMessage(text, userId) {
    console.log('正在检查是否存在重复消息:', { userId });
    try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
        .eq('text', text)
        .eq('user_id', userId)
        .limit(1);

    if (error) {
        console.error('检查重复消息失败:', error);
      throw error;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('检查重复消息时发生错误:', error);
      throw new Error('检查重复消息失败: ' + (error.message || '未知错误'));
    }
  },

  // 创建新消息
  async createMessage({ text, userId, originalText }) {
    console.log('正在创建新消息:', { text, userId });
    try {
      // 首先检查是否存在重复消息
      const isDuplicate = await this.checkDuplicateMessage(text, userId);
      if (isDuplicate) {
        throw new Error('您已经发送过相同的留言了');
      }

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        text,
        user_id: userId,
          original_text: originalText,
          created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
        console.error('创建消息失败:', error);
      throw error;
    }

      console.log('消息创建成功:', data?.[0]?.id);
    return data[0];
    } catch (error) {
      console.error('创建消息时发生错误:', error);
      throw new Error(error.message || '创建消息失败');
    }
  },

  // 删除消息
  async deleteMessage(messageId, userId, isAdmin) {
    console.log('正在删除消息:', { messageId, userId, isAdmin });
    try {
      // 首先检查消息是否存在
      const { data: message, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (fetchError) {
        console.error('查找消息失败:', fetchError);
        throw new Error('查找消息时出错');
      }

      if (!message) {
        console.error('消息不存在:', messageId);
        throw new Error('消息不存在');
      }

      // 检查权限
      if (!isAdmin && message.user_id !== userId) {
        console.error('无权限删除:', { messageUserId: message.user_id, userId });
        throw new Error('您没有权限删除此消息');
      }

      // 执行删除操作
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) {
        console.error('删除消息失败:', deleteError);
        throw new Error('删除消息时出错');
      }

      console.log('消息删除成功:', messageId);
      return true;
    } catch (error) {
      console.error('删除消息时发生错误:', error);
      throw new Error('删除消息失败: ' + (error.message || '未知错误'));
    }
  },

  // 计算用户在过去24小时内的留言数量
  async countUserMessagesInLast24Hours(userId) {
    console.log('正在统计用户24小时内的留言数:', userId);
    try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', twentyFourHoursAgo);

    if (error) {
        console.error('统计消息数量失败:', error);
        throw error;
      }

      console.log('用户24小时内的留言数:', count);
      return count || 0;
    } catch (error) {
      console.error('统计消息数量时发生错误:', error);
      return Infinity; // 返回无限大，确保用户无法发送新消息直到错误解决
    }
  },

  // 切换消息置顶状态
  async toggleMessagePin(messageId, isPinned) {
    console.log('正在切换消息置顶状态:', { messageId, isPinned });
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_pinned: isPinned })
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        console.error('切换置顶状态失败:', error);
        throw error;
      }

      console.log('消息置顶状态已更新:', data);
      return data;
    } catch (error) {
      console.error('切换置顶状态时发生错误:', error);
      throw new Error('切换置顶状态失败: ' + (error.message || '未知错误'));
    }
  },

  // 获取消息的回复
  async getMessageReplies(messageId) {
    console.log('正在获取消息回复:', messageId);
    try {
      const { data, error } = await supabase
        .from('message_replies')
        .select(`
          id,
          message_id,
          user_id,
          text,
          original_text,
          created_at,
          is_admin
        `)
        .eq('message_id', messageId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('获取回复失败:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('获取回复时发生错误:', error);
      return [];
    }
  },

  // 创建新回复
  async createReply({ messageId, userId, text, originalText }) {
    console.log('正在创建回复:', { messageId, userId });
    try {
      // 检查24小时内的回复数量（仅对非管理员用户）
      if (userId !== 'admin') {
        const replyCount = await this.countUserMessagesAndRepliesInLast24Hours(userId);
        if (replyCount >= 6) {
          throw new Error('您在24小时内的留言和回复总数已达到上限(6条)');
        }
      }

      const { data, error } = await supabase
        .from('message_replies')
        .insert([{
          message_id: messageId,
          user_id: userId,
          text,
          original_text: originalText,
          is_admin: userId === 'admin',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('创建回复失败:', error);
        throw error;
      }

      console.log('回复创建成功:', data?.[0]?.id);
      return data[0];
    } catch (error) {
      console.error('创建回复时发生错误:', error);
      throw new Error(error.message || '创建回复失败');
    }
  },

  // 删除回复
  async deleteReply(replyId, userId, isAdmin) {
    console.log('正在删除回复:', { replyId, userId, isAdmin });
    try {
      // 首先检查回复是否存在
      const { data: reply, error: fetchError } = await supabase
        .from('message_replies')
        .select('*')
        .eq('id', replyId)
        .single();

      if (fetchError) {
        console.error('查找回复失败:', fetchError);
        throw new Error('查找回复时出错');
      }

      if (!reply) {
        console.error('回复不存在:', replyId);
        throw new Error('回复不存在');
      }

      // 检查权限
      if (!isAdmin && reply.user_id !== userId) {
        console.error('无权限删除:', { replyUserId: reply.user_id, userId });
        throw new Error('您没有权限删除此回复');
      }

      // 执行删除操作
      const { error: deleteError } = await supabase
        .from('message_replies')
        .delete()
        .eq('id', replyId);

      if (deleteError) {
        console.error('删除回复失败:', deleteError);
        throw new Error('删除回复时出错');
      }

      console.log('回复删除成功:', replyId);
      return true;
    } catch (error) {
      console.error('删除回复时发生错误:', error);
      throw new Error('删除回复失败: ' + (error.message || '未知错误'));
    }
  },

  // 统计用户24小时内的留言和回复总数
  async countUserMessagesAndRepliesInLast24Hours(userId) {
    console.log('正在统计用户24小时内的留言和回复数:', userId);
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // 获取留言数量
      const { count: messageCount, error: messageError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', twentyFourHoursAgo);

      if (messageError) throw messageError;

      // 获取回复数量
      const { count: replyCount, error: replyError } = await supabase
        .from('message_replies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', twentyFourHoursAgo);

      if (replyError) throw replyError;

      const totalCount = (messageCount || 0) + (replyCount || 0);
      console.log('用户24小时内的总数:', totalCount);
      return totalCount;
    } catch (error) {
      console.error('统计留言和回复数量时发生错误:', error);
      return Infinity; // 返回无限大，确保用户无法发送新消息直到错误解决
    }
  },

  // 更新消息的赞踩数量（仅限管理员）
  async updateMessageReactions(messageId, likes, dislikes) {
    console.log('正在更新消息反应数量:', { messageId, likes, dislikes });
    try {
      // 首先删除该消息的所有现有反应
      const { error: deleteError } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId);

      if (deleteError) {
        console.error('删除现有反应失败:', deleteError);
        throw new Error('更新反应失败：无法删除现有反应');
      }

      // 添加新的点赞
      const likesPromises = Array(likes).fill().map(() => 
        supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: 'admin',
            is_like: true
          })
      );

      // 添加新的点踩
      const dislikesPromises = Array(dislikes).fill().map(() => 
        supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: 'admin',
            is_like: false
          })
      );

      // 等待所有操作完成
      const results = await Promise.all([...likesPromises, ...dislikesPromises]);
      
      // 检查是否有任何错误
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('添加新反应时发生错误:', errors);
        throw new Error('更新反应失败：无法添加新的反应');
      }

      console.log('成功更新消息反应数量');
      return true;
    } catch (error) {
      console.error('更新消息反应数量失败:', error);
      throw new Error('更新反应失败: ' + (error.message || '未知错误'));
    }
  }
}

// 测试记录相关的数据库操作
export const testRecordsApi = {
  // 检查表是否存在
  async checkTablesExist() {
    try {
      // 尝试查询每个表来检查是否存在
      const { error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      const { error: recordsError } = await supabase
        .from('test_records')
        .select('id')
        .limit(1);

      const { error: resultsError } = await supabase
        .from('test_results')
        .select('id')
        .limit(1);

      return {
        users: !usersError,
        test_records: !recordsError,
        test_results: !resultsError,
        allExist: !usersError && !recordsError && !resultsError
      };
    } catch (error) {
      console.error('检查表存在性失败:', error);
      return {
        users: false,
        test_records: false,
        test_results: false,
        allExist: false
      };
    }
  },

  // 保存测试记录
  async saveTestRecord({ userId, nickname, testType, ratings, reportData }) {
    console.log('正在保存测试记录:', { userId, nickname, testType });
    try {
      // 首先检查表是否存在
      const tablesStatus = await this.checkTablesExist();
      if (!tablesStatus.allExist) {
        throw new Error(`数据库表不存在。缺少的表: ${Object.entries(tablesStatus).filter(([key, exists]) => key !== 'allExist' && !exists).map(([key]) => key).join(', ')}`);
      }

      // 首先保存或更新用户信息
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert([{
          id: userId,
          nickname: nickname || '匿名用户',
          last_active: new Date().toISOString()
        }], {
          onConflict: 'id'
        })
        .select();

      if (userError) {
        console.error('保存用户信息失败:', userError);
        throw userError;
      }

      // 准备测试记录数据，适配现有表结构
      const recordInsertData = {
        user_id_text: userId, // 使用新添加的 user_id_text 列
        test_type: testType,
        report_data: reportData, // 现在应该存在这个列
        created_at: new Date().toISOString()
      };

      // 保存测试记录
      const { data: recordData, error: recordError } = await supabase
        .from('test_records')
        .insert([recordInsertData])
        .select();

      if (recordError) {
        console.error('保存测试记录失败:', recordError);
        throw recordError;
      }

      const recordId = recordData[0].id;

      // 保存详细的测试结果
      const resultEntries = Object.entries(ratings).map(([key, rating]) => {
        const [category, item] = key.split('-');
        return {
          record_id: recordId,
          category,
          item,
          rating,
          created_at: new Date().toISOString()
        };
      });

      if (resultEntries.length > 0) {
        const { error: resultsError } = await supabase
          .from('test_results')
          .insert(resultEntries);

        if (resultsError) {
          console.error('保存测试结果失败:', resultsError);
          throw resultsError;
        }
      }

      console.log('测试记录保存成功:', recordId);
      return recordData[0];
    } catch (error) {
      console.error('保存测试记录时发生错误:', error);
      throw new Error('保存测试记录失败: ' + (error.message || '未知错误'));
    }
  },

  // 获取用户的测试记录列表
  async getUserTestRecords(userId) {
    console.log('正在获取用户测试记录:', userId);
    try {
      const { data, error } = await supabase
        .from('test_records')
        .select(`
          id,
          test_type,
          report_data,
          created_at,
          updated_at
        `)
        .eq('user_id_text', userId) // 使用 user_id_text 列
        .order('created_at', { ascending: false });

      if (error) {
        console.error('获取测试记录失败:', error);
        throw error;
      }

      console.log('成功获取测试记录:', data?.length || 0, '条');
      return data || [];
    } catch (error) {
      console.error('获取测试记录时发生错误:', error);
      throw new Error('获取测试记录失败: ' + (error.message || '未知错误'));
    }
  },

  // 获取特定测试记录的详细结果
  async getTestRecordDetails(recordId) {
    console.log('正在获取测试记录详情:', recordId);
    try {
      // 获取记录基本信息
      const { data: recordData, error: recordError } = await supabase
        .from('test_records')
        .select(`
          id,
          test_type,
          report_data,
          created_at,
          user_id_text
        `)
        .eq('id', recordId)
        .single();

      if (recordError) {
        console.error('获取记录基本信息失败:', recordError);
        throw recordError;
      }

      // 获取详细结果
      const { data: resultsData, error: resultsError } = await supabase
        .from('test_results')
        .select('category, item, rating')
        .eq('record_id', recordId);

      if (resultsError) {
        console.error('获取详细结果失败:', resultsError);
        throw resultsError;
      }

      // 重构ratings对象
      const ratings = {};
      resultsData.forEach(result => {
        ratings[`${result.category}-${result.item}`] = result.rating;
      });

      return {
        ...recordData,
        ratings
      };
    } catch (error) {
      console.error('获取测试记录详情时发生错误:', error);
      throw new Error('获取测试记录详情失败: ' + (error.message || '未知错误'));
    }
  },

  // 删除测试记录
  async deleteTestRecord(recordId, userId) {
    console.log('正在删除测试记录:', { recordId, userId });
    try {
      // 首先验证记录是否属于该用户
      const { data: recordData, error: fetchError } = await supabase
        .from('test_records')
        .select('user_id_text')
        .eq('id', recordId)
        .single();

      if (fetchError) {
        console.error('查找记录失败:', fetchError);
        throw new Error('查找记录时出错');
      }

      if (recordData.user_id_text !== userId) {
        throw new Error('您没有权限删除此记录');
      }

      // 删除记录（级联删除会自动删除相关的test_results）
      const { error: deleteError } = await supabase
        .from('test_records')
        .delete()
        .eq('id', recordId);

      if (deleteError) {
        console.error('删除记录失败:', deleteError);
        throw deleteError;
      }

      console.log('测试记录删除成功:', recordId);
      return true;
    } catch (error) {
      console.error('删除测试记录时发生错误:', error);
      throw new Error('删除测试记录失败: ' + (error.message || '未知错误'));
    }
  },

  // 获取用户最新的测试记录
  async getLatestTestRecord(userId, testType) {
    console.log('正在获取最新测试记录:', { userId, testType });
    try {
      const { data, error } = await supabase
        .from('test_records')
        .select(`
          id,
          test_type,
          report_data,
          created_at
        `)
        .eq('user_id_text', userId) // 使用 user_id_text 列
        .eq('test_type', testType)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('获取最新记录失败:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return null;
      }

      // 获取详细结果
      const recordId = data[0].id;
      const { data: resultsData, error: resultsError } = await supabase
        .from('test_results')
        .select('category, item, rating')
        .eq('record_id', recordId);

      if (resultsError) {
        console.error('获取详细结果失败:', resultsError);
        return data[0]; // 返回基本信息，不包含详细结果
      }

      // 重构ratings对象
      const ratings = {};
      resultsData.forEach(result => {
        ratings[`${result.category}-${result.item}`] = result.rating;
      });

      return {
        ...data[0],
        ratings
      };
    } catch (error) {
      console.error('获取最新测试记录时发生错误:', error);
      return null; // 不抛出错误，返回null表示没有记录
    }
  }
};

export default messagesApi;