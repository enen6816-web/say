# 集成小米酱智能助手的静态文件服务器
import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys
import json
import requests

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 尝试从环境变量获取端口，如果没有则使用默认值
import os
PORT = int(os.environ.get('PORT', 8005))

# 确保在正确的目录下
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 尝试导入模型文件中的功能
use_openai_client = False
imported_client = None
try:
    # 尝试导入model目录下的文件
    from model.daima import get_system_prompt as imported_get_system_prompt, create_agent
    # 不直接导入client，而是导入create_agent函数
    use_openai_client = True
    print("✅ 成功导入model目录中的功能")
except ImportError as e:
    print(f"⚠️ 无法导入model目录中的功能: {e}，将使用requests实现作为备选")
    
# 定义备用的系统提示函数
def get_system_prompt():
    """设置智能体的系统提示，包括名称、性格和跃动青春漫画知识"""
    try:
        # 如果成功导入了daima.py中的函数，则使用它
        if use_openai_client:
            return imported_get_system_prompt()
    except Exception as e:
        print(f"⚠️ 使用导入的系统提示失败: {e}")
    
    # 备用的系统提示
    return """
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
"""

# 使用requests直接调用API的函数
def call_llm_api(messages, model="Qwen/Qwen3-Next-80B-A3B-Instruct"):
    """智能调用LLM API，优先使用OpenAI客户端，失败时回退到requests实现"""
    # 尝试使用OpenAI客户端（如果可用）
    if use_openai_client:
        try:
            print(f"[API] 使用OpenAI客户端调用 {model} 模型")
            
            # 获取或创建客户端
            try:
                client = imported_client
            except Exception:
                client = create_agent()
            
            # 调用API
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                stream=False  # 非流式响应，便于HTTP处理
            )
            
            # 处理响应
            if response.choices and response.choices[0].message:
                reply = response.choices[0].message.content
                print(f"[API] 成功获取响应，长度: {len(reply)} 字符")
                return reply.strip()
            else:
                return "API返回了空响应，请稍后再试"
                
        except Exception as e:
            print(f"[API错误] OpenAI客户端调用失败: {e}，将回退到requests实现")
    
    # OpenAI客户端不可用或调用失败，回退到requests实现
    try:
        url = "https://api-inference.modelscope.cn/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer ms-01635b88-cd3c-4e98-ad6a-be706be66187"
        }
        data = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500,
            "stream": False
        }
        
        print(f"[API] 使用requests发送请求到 {url}，模型: {model}")
        
        # 添加重试机制
        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                response = requests.post(url, headers=headers, json=data, timeout=30)
                
                # 处理速率限制
                if response.status_code == 429:
                    wait_time = 2 ** attempt  # 指数退避
                    print(f"[API] 速率限制，等待 {wait_time} 秒后重试 (尝试 {attempt + 1}/{max_retries + 1})")
                    time.sleep(wait_time)
                    continue
                
                response.raise_for_status()  # 检查其他HTTP错误
                break  # 成功则退出循环
                
            except requests.exceptions.Timeout:
                if attempt == max_retries:
                    return "网络连接超时，请检查您的网络连接或稍后再试"
                wait_time = 2 ** attempt
                print(f"[API] 请求超时，等待 {wait_time} 秒后重试 (尝试 {attempt + 1}/{max_retries + 1})")
                time.sleep(wait_time)
        
        result = response.json()
        print(f"[API] 收到响应，状态码: {response.status_code}")
        
        # 检查响应格式
        if "choices" in result and result["choices"] and "message" in result["choices"][0]:
            reply = result["choices"][0]["message"]["content"]
            # 清理回复内容
            return reply.strip()
        else:
            error_details = json.dumps(result, ensure_ascii=False)[:200]  # 限制错误信息长度
            return f"API返回格式异常，请联系管理员检查服务器配置。错误详情: {error_details}..."
            
    except requests.exceptions.RequestException as e:
        error_type = type(e).__name__
        if "ConnectionError" in error_type:
            return "网络连接失败，请检查您的互联网连接"
        elif "Timeout" in error_type:
            return "服务器响应超时，请稍后再试"
        else:
            return f"网络请求错误: {str(e)[:100]}..."
    except Exception as e:
        # 不暴露详细的内部错误给用户
        print(f"[API错误详情] {str(e)}")
        return "调用API时出现未知错误，请稍后再试"
    
    # 添加默认回复作为最后的保障
    return "小米酱暂时无法回复，请稍后再试哦！(*^▽^*)"


# 对话历史存储 - 使用字典按会话ID存储
session_conversations = {}

# 自定义请求处理器
class CustomHandler(http.server.SimpleHTTPRequestHandler):
    # 重写日志方法，记录关键信息
    def log_message(self, format, *args):
        # 记录API请求和错误
        message = format % args
        if '/api/chat' in message or 'error' in message.lower() or 'exception' in message.lower():
            print(f"[LOG] {message}")
        return
    
    # 自定义错误页面
    def send_error(self, code, message=None):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_data = {
            'error': {
                'code': code,
                'message': message or f"HTTP Error {code}",
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            }
        }
        self.wfile.write(json.dumps(error_data).encode('utf-8'))
    
    # 处理API请求
    def do_POST(self):
        if self.path == '/api/chat':
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            try:
                request_data = json.loads(post_data)
                user_messages = request_data.get('messages', [])
                session_id = request_data.get('session_id', 'default')  # 支持多会话
                
                if not user_messages:
                    response = json.dumps({"response": "你好！我是小米酱，很高兴认识你！"})
                else:
                    # 获取用户最新消息
                    latest_user_message = user_messages[-1]['content']
                    
                    # 获取或创建会话历史
                    if session_id not in session_conversations:
                        # 初始化新会话，添加系统提示
                        session_conversations[session_id] = [
                            {'role': 'system', 'content': get_system_prompt()}
                        ]
                    
                    # 更新对话历史
                    session_conversations[session_id].append({'role': 'user', 'content': latest_user_message})
                    
                    # 限制对话历史长度
                    if len(session_conversations[session_id]) > 12:  # 1条系统提示 + 10条对话 + 1条最新消息
                        session_conversations[session_id] = session_conversations[session_id][:1] + session_conversations[session_id][-10:]
                    
                    print(f"[API] 收到会话 {session_id} 的消息: {latest_user_message}")
                    
                    try:
                        # 调用API获取响应
                        print(f"[API] 调用Qwen3-Next-80B-A3B-Instruct模型")
                        assistant_reply = call_llm_api(session_conversations[session_id])
                        
                        print(f"[API] 回复会话 {session_id}: {assistant_reply[:50]}...")
                        
                        # 更新对话历史
                        session_conversations[session_id].append({'role': 'assistant', 'content': assistant_reply})
                    except Exception as api_error:
                        error_msg = str(api_error)
                        assistant_reply = f"抱歉，调用智能助手API时出现错误: {error_msg}"
                        print(f"[API错误] 会话 {session_id}: {error_msg}")
                    
                    # 构造响应
                    response = json.dumps({"response": assistant_reply, "session_id": session_id})
                
            except Exception as e:
                error_message = f"API处理错误: {str(e)}"
                print(error_message)
                response = json.dumps({"response": f"抱歉，处理请求时出现错误: {str(e)}"})
            
            # 发送响应
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.send_header('Content-Length', str(len(response)))
            self.end_headers()
            self.wfile.write(response.encode('utf-8'))
        else:
            # 其他POST请求交给父类处理
            super().do_POST()

# 创建并启动服务器
try:
    # 使用TCPServer（单线程），更简单稳定
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"服务器启动在 http://localhost:{PORT}")
        print(f"🌐 访问地址: http://localhost:{PORT}")
        print(f"🔗 API地址: http://localhost:{PORT}/api/chat")
        print("按 Ctrl+C 停止服务器")
        print("✅ 小米酱智能助手已集成")
        print(f"🔧 API实现模式: {'OpenAI客户端' if use_openai_client else 'requests备选'}")
        print(f"🔍 模型配置: Qwen/Qwen3-Next-80B-A3B-Instruct")
        print("💡 如需测试聊天功能，请在页面中与小米酱对话")
        print("📚 系统提示: 已集成daima.py中的跃动青春漫画知识")
        print("🔄 自动回退: 如OpenAI调用失败，将自动切换到requests实现")
        
        # 在新线程中打开浏览器
        def open_browser():
            time.sleep(1)
            webbrowser.open(f'http://localhost:{PORT}')
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        # 启动服务
        httpd.serve_forever()
except Exception as e:
    print(f"启动服务器时出错: {e}")
    input("按Enter键退出...")

