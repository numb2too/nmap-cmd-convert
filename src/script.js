let generatedCommand = '';

function convertPorts() {
    const scanResult = document.getElementById('scanResult').value;
    const targetHost = document.getElementById('targetHost').value.trim();
    const output = document.getElementById('output');
    const stats = document.getElementById('stats');

    if (!scanResult.trim()) {
        output.textContent = '❌ 請輸入 nmap 掃描結果';
        output.style.color = '#ef4444';
        stats.style.display = 'none';
        return;
    }

    if (!targetHost) {
        output.textContent = '❌ 請輸入目標主機';
        output.style.color = '#ef4444';
        stats.style.display = 'none';
        return;
    }

    // 提取所有 port（支援多種格式）
    const portRegex = /(\d+)\/(tcp|udp)/g;
    const ports = [];
    const services = new Set();
    let match;

    while ((match = portRegex.exec(scanResult)) !== null) {
        ports.push(match[1]);
    }

    // 提取服務名稱
    const serviceRegex = /open\s+(\S+)/g;
    while ((match = serviceRegex.exec(scanResult)) !== null) {
        services.add(match[1]);
    }

    if (ports.length === 0) {
        output.textContent = '❌ 未找到任何 port，請確認輸入格式';
        output.style.color = '#ef4444';
        stats.style.display = 'none';
        return;
    }

    // 生成指令
    const portList = ports.join(',');
    generatedCommand = `nmap -p ${portList} -sV -sC -v ${targetHost}`;

    output.textContent = generatedCommand;
    output.style.color = '#10b981';

    // 更新統計
    document.getElementById('portCount').textContent = ports.length;
    document.getElementById('serviceCount').textContent = services.size;
    stats.style.display = 'flex';
}

function copyCommand() {
    if (!generatedCommand) {
        showToast('❌ 請先轉換指令', '#ef4444');
        return;
    }

    navigator.clipboard.writeText(generatedCommand).then(() => {
        showToast('✅ 指令已複製到剪貼簿！', '#10b981');
    }).catch(() => {
        showToast('❌ 複製失敗', '#ef4444');
    });
}

function clearAll() {
    document.getElementById('scanResult').value = '';
    document.getElementById('targetHost').value = 'cyberlens.thm';
    document.getElementById('output').textContent = '等待輸入...';
    document.getElementById('output').style.color = '#10b981';
    document.getElementById('stats').style.display = 'none';
    generatedCommand = '';
}

function showToast(message, color) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = color;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 自動載入範例資料
window.addEventListener('load', () => {
    const exampleData = `PORT      STATE SERVICE
    80/tcp    open  http
    135/tcp   open  msrpc
    139/tcp   open  netbios-ssn
    445/tcp   open  microsoft-ds
    3389/tcp  open  ms-wbt-server
    5985/tcp  open  wsman
    7680/tcp  open  pando-pub
    47001/tcp open  winrm
    49664/tcp open  unknown
    49665/tcp open  unknown
    49666/tcp open  unknown
    49667/tcp open  unknown
    49668/tcp open  unknown
    49669/tcp open  unknown
    49670/tcp open  unknown
    49674/tcp open  unknown
    61777/tcp open  unknown`;

    document.getElementById('scanResult').value = exampleData;
    convertPorts();
});
