// Vercel API路由 - 智能助手聊天接口
// 直接转发请求到ModelScope API，避免依赖本地Python服务器

// 导入Node.js内置模块
const https = require('https');

// 对话历史存储 - 使用Map按会话ID存储
const sessionConversations = new Map();

// 系统提示信息
function getSystemPrompt() {
  return `
你好！我是一个充满活力、热血的AI助手，我的名字是"小米酱"！

我的性格特点：
- 充满活力，总是充满热情和正能量
- 热血积极，喜欢鼓励和支持他人
- 说话直接坦率，有时会有点冲动但充满善意
- 喜欢使用表情符号和活泼的语气，让对话更有活力

我对《跃动青春》漫画非常了解！这是一部由高松美咲创作的青春校园漫画，讲述了来自小地方的高一女生岩仓美津未（小美）来到东京上学后，与同学们特别是同班同学志摩聪介之间展开的青春成长故事。

主要角色：
- 岩仓美津未（小美）：从乡下到东京就读高中的女生，学习能力强但社交经验少，性格认真、努力
- 志摩聪介：出身于演艺世家的美少年，性格温柔但内心有自己的烦恼
- 志摩京佑：志摩聪介的弟弟，也是美少年
- 田边灯里：美津未的好友，时尚可爱的女生
- 久留米诚：灯里的男友，足球队成员
- 村重结月：美津未的同学，文静但有自己的坚持
- 大槻香织：学生会副会长，做事认真

请以充满活力的方式与我交谈吧！我会用"小米酱"的身份来回应用你的问题！
`;
}

// 调用ModelScope API的函数
async function callModelScopeAPI(messages) {
  return new Promise((resolve, reject) => {
    const model = "Qwen/Qwen3-Next-80B-A3B-Instruct";
    const url = "https://api-inference.modelscope.cn/v1/chat/completions";
    
    // 准备请求数据
    const data = JSON.stringify({
      "model": model,
      "messages": messages,
      "temperature": 0.7,
      "max_tokens": 500,
      "stream": false
    });
    
    // 准备请求选项
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ms-01635b88-cd3c-4e98-ad6a-be706be66187",
        "Content-Length": data.length
      }
    };
    
    // 发送请求
    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      // 收集响应数据
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      // 处理完整响应
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          
          // 检查响应状态码
          if (res.statusCode !== 200) {
            console.error(`API错误: 状态码 ${res.statusCode}`, result);
            reject(new Error(`API返回错误: ${result.error?.message || '未知错误'}`));
            return;
          }
          
          // 检查响应格式
          if (result.choices && result.choices[0] && result.choices[0].message) {
            resolve(result.choices[0].message.content.trim());
          } else {
            reject(new Error(`API返回格式异常: ${JSON.stringify(result).substring(0, 200)}...`));
          }
        } catch (e) {
          reject(new Error(`解析响应时出错: ${e.message}`));
        }
      });
    });
    
    // 处理请求错误
    req.on('error', (error) => {
      console.error('请求错误:', error);
      reject(new Error(`网络请求失败: ${error.message}`));
    });
    
    // 发送请求体
    req.write(data);
    req.end();
  });
}

// Vercel API处理函数
export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ response: '只支持POST请求' });
  }
  
  try {
    const requestData = req.body;
    const userMessages = requestData?.messages || [];
    const sessionId = requestData?.session_id || 'default';
    
    // 初始化响应
    if (!userMessages || userMessages.length === 0) {
      return res.status(200).json({ 
        response: "你好！我是小米酱，很高兴认识你！",
        session_id: sessionId
      });
    }
    
    // 获取用户最新消息
    const latestUserMessage = userMessages[userMessages.length - 1]?.content;
    
    // 获取或创建会话历史
    if (!sessionConversations.has(sessionId)) {
      // 初始化新会话，添加系统提示
      sessionConversations.set(sessionId, [
        { role: 'system', content: getSystemPrompt() }
      ]);
    }
    
    const conversation = sessionConversations.get(sessionId);
    
    // 更新对话历史
    conversation.push({ role: 'user', content: latestUserMessage });
    
    // 限制对话历史长度
    if (conversation.length > 12) {  // 1条系统提示 + 10条对话 + 1条最新消息
      const newConversation = conversation.slice(0, 1);
      newConversation.push(...conversation.slice(-10));
      sessionConversations.set(sessionId, newConversation);
    }
    
    console.log(`[API] 收到会话 ${sessionId} 的消息: ${latestUserMessage}`);
    
    // 调用ModelScope API获取响应
    let assistantReply;
    try {
      console.log(`[API] 调用 ${model} 模型`);
      assistantReply = await callModelScopeAPI(conversation);
      console.log(`[API] 回复会话 ${sessionId}: ${assistantReply.substring(0, 50)}...`);
      
      // 更新对话历史
      conversation.push({ role: 'assistant', content: assistantReply });
    } catch (apiError) {
      const errorMsg = apiError.message;
      assistantReply = `抱歉，调用智能助手API时出现错误: ${errorMsg}`;
      console.error(`[API错误] 会话 ${sessionId}: ${errorMsg}`);
    }
    
    // 返回响应
    return res.status(200).json({ 
      response: assistantReply,
      session_id: sessionId
    });
    
  } catch (error) {
    const errorMessage = `处理请求时出现错误: ${error.message}`;
    console.error(errorMessage);
    return res.status(500).json({ 
      response: errorMessage 
    });
  }
}
