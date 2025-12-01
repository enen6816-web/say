@echo off

rem 启动集成小米酱智能助手的完整服务器
set PORT=8005

rem 输出启动信息
echo 正在启动《跃动青春》主题网站服务器（集成小米酱智能助手）...
echo 端口: %PORT%
echo 访问地址: http://localhost:%PORT%
echo API地址: http://localhost:%PORT%/api/chat
echo 
echo 提示：小米酱智能助手已完全集成，支持完整对话功能
echo 
echo 按 Ctrl+C 停止服务器

rem 调用集成智能助手的服务器脚本
python start_server.py