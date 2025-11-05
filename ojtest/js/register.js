// 注册表单提交事件
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const alertArea = document.getElementById('alert-area');

    // 验证输入
    if (!username || !password) {
        alertArea.innerHTML = '<div class="alert alert-danger">用户名和密码不能为空！</div>';
        return;
    }
    if (password.length < 6) {
        alertArea.innerHTML = '<div class="alert alert-danger">密码长度不能少于6位！</div>';
        return;
    }
    if (password !== confirmPassword) {
        alertArea.innerHTML = '<div class="alert alert-danger">两次输入的密码不一致！</div>';
        return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        alertArea.innerHTML = '<div class="alert alert-danger">用户名只能包含字母和数字！</div>';
        return;
    }

    // 调用注册工具
    const registerSuccess = UserUtil.register({
        username,
        nickname,
        password
    });

    if (registerSuccess) {
        alertArea.innerHTML = '<div class="alert alert-success">注册成功，即将跳转登录...</div>';
        setTimeout(() => {
            window.location.href = '/ojtest/login.html';
        }, 1500);
    } else {
        alertArea.innerHTML = '<div class="alert alert-danger">用户名已存在！</div>';
    }
});

// 页面加载时检查是否已登录
window.addEventListener('load', () => {
    if (UserUtil.isLogin()) {
        window.location.href = '/ojtest/index.html';
    }
});
