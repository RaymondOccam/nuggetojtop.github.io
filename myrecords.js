// 渲染提交记录
function renderSubmissions() {
    const user = UserUtil.getCurrentUser();
    const submissions = SubmissionUtil.getUserSubmissions(user.username);
    const tableBody = document.getElementById('submissions-table').querySelector('tbody');

    if (submissions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">暂无提交记录</td></tr>';
        return;
    }

    const statusTextMap = {
        'pending': '判题中',
        'accepted': '通过',
        'wrong_answer': '答案错误',
        'time_limit': '超时',
        'memory_limit': '内存超限',
        'compile_error': '编译错误',
        'runtime_error': '运行错误'
    };

    const statusClassMap = {
        'pending': 'pending',
        'accepted': 'accepted',
        'wrong_answer': 'wrong',
        'time_limit': 'warning',
        'memory_limit': 'warning',
        'compile_error': 'error',
        'runtime_error': 'error'
    };

    let html = '';
    submissions.forEach(submission => {
        const problem = ProblemUtil.getProblemById(submission.problemId);
        const problemTitle = problem ? problem.title : '题目已删除';
        const problemUrl = problem ? `/ojtest/problem/detail.html?id=${submission.problemId}` : '#';

        html += `
            <tr>
                <td>${submission.id}</td>
                <td><a href="${problemUrl}" style="color: #3498db; text-decoration: none;">${problemTitle}</a></td>
                <td>${submission.language}</td>
                <td><span class="status-tag ${statusClassMap[submission.status] || 'pending'}">${statusTextMap[submission.status] || '未知'}</span></td>
                <td>${submission.score}</td>
                <td>${submission.submitTime}</td>
                <td>
                    <button class="btn btn-sm" onclick="viewCode('${submission.id}')">查看代码</button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

// 查看提交的代码
function viewCode(submissionId) {
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) || [];
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    // 创建弹窗显示代码
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    const modalContent = document.createElement('div');
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '1000px';
    modalContent.style.background = '#fff';
    modalContent.style.borderRadius = '8px';
    modalContent.style.padding = '20px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflow = 'auto';

    const modalHeader = document.createElement('div');
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
    modalHeader.style.marginBottom = '15px';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = `提交ID: ${submission.id} | 语言: ${submission.language}`;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.className = 'btn btn-danger btn-sm';
    closeBtn.onclick = () => document.body.removeChild(modal);

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);

    const codePre = document.createElement('pre');
    codePre.style.background = '#f8f9fa';
    codePre.style.padding = '15px';
    codePre.style.borderRadius = '4px';
    codePre.style.fontFamily = 'Consolas, monospace';
    codePre.style.fontSize = '14px';
    codePre.textContent = submission.code;

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(codePre);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}

// 页面加载时初始化
window.addEventListener('load', () => {
    const user = UserUtil.getCurrentUser();
    const notLoginAlert = document.getElementById('not-login-alert');
    const recordsContainer = document.getElementById('records-container');

    if (!user) {
        notLoginAlert.style.display = 'block';
        recordsContainer.style.display = 'none';
        return;
    }

    notLoginAlert.style.display = 'none';
    recordsContainer.style.display = 'block';
    renderSubmissions();
});
