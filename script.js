// ===== 多语言配置 =====
const translations = {
    en: {
        title: "Find Your Perfect Vehicle",
        subtitle: "AI-powered recommendations for cars and motorcycles in Malaysia",
        budget_label: "Your Budget (RM)",
        purpose_label: "Main Purpose",
        passengers_label: "Passengers",
        cta_button: "Find My Vehicle",
        results_title: "Recommended Vehicles",
        family: "Family Use",
        commute: "Daily Commute",
        work: "Work/Business",
        adventure: "Adventure/Touring",
        seats: "Seats",
        fuel: "Fuel (L/100km)",
        maintenance: "Maintenance Cost",
        reason: "Why we recommend:"
    },
    zh: {
        title: "寻找您的理想座驾",
        subtitle: "AI驱动的马来西亚汽车和摩托车推荐平台",
        budget_label: "您的预算 (马币)",
        purpose_label: "主要用途",
        passengers_label: "乘客数量",
        cta_button: "查找车辆",
        results_title: "推荐车辆",
        family: "家庭使用",
        commute: "日常通勤",
        work: "工作/商务",
        adventure: "冒险/旅行",
        seats: "座位数",
        fuel: "油耗 (L/100km)",
        maintenance: "维护成本",
        reason: "推荐理由:"
    },
    ms: {
        title: "Cari Kenderaan Sempurna Anda",
        subtitle: "Cadangan berkuasa AI untuk kereta dan motosikal di Malaysia",
        budget_label: "Bajet Anda (RM)",
        purpose_label: "Kegunaan Utama",
        passengers_label: "Penumpang",
        cta_button: "Cari Kenderaan Saya",
        results_title: "Kenderaan Disyorkan",
        family: "Keluarga",
        commute: "Harian",
        work: "Kerja/Perusahaan",
        adventure: "Pengembaraan/Pelancongan",
        seats: "Tempat Duduk",
        fuel: "Minuman (L/100km)",
        maintenance: "Kos Penyelenggaraan",
        reason: "Sebab kami cadangkan:"
    }
};

// ===== 初始化语言 =====
document.addEventListener('DOMContentLoaded', function() {
    // 默认语言
    let lang = localStorage.getItem('drivenex-lang') || 'en';
    setLanguage(lang);
    
    // 设置语言切换事件
    document.querySelectorAll('.language-switcher button').forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
});

function setLanguage(lang) {
    // 保存语言选择
    localStorage.setItem('drivenex-lang', lang);
    
    // 获取翻译文本
    const t = translations[lang];
    
    // 更新界面文本
    document.getElementById('hero-title').textContent = t.title;
    document.getElementById('hero-subtitle').textContent = t.subtitle;
    document.querySelector('.form-group:nth-child(1) label').textContent = t.budget_label;
    document.querySelector('.form-group:nth-child(2) label').textContent = t.purpose_label;
    document.querySelector('.form-group:nth-child(3) label').textContent = t.passengers_label;
    document.querySelector('.cta-button').textContent = t.cta_button;
    document.querySelector('.results h2').textContent = t.results_title;
    
    // 更新下拉菜单选项
    const purposeSelect = document.getElementById('purpose');
    purposeSelect.innerHTML = `
        <option value="family">${t.family}</option>
        <option value="commute">${t.commute}</option>
        <option value="work">${t.work}</option>
        <option value="adventure">${t.adventure}</option>
    `;
}

// ===== 车辆推荐功能 =====
async function getRecommendations() {
    // 获取用户输入
    const budget = parseInt(document.getElementById('budget').value);
    const purpose = document.getElementById('purpose').value;
    const passengers = parseInt(document.getElementById('passengers').value);
    const lang = localStorage.getItem('drivenex-lang') || 'en';
    const t = translations[lang];
    
    // 验证输入
    if (!budget || !passengers) {
        alert("Please fill in all fields");
        return;
    }
    
    // 获取车型数据
    const response = await fetch('data/cars.json');
    const allVehicles = await response.json();
    
    // 过滤逻辑
    const recommended = allVehicles.filter(vehicle => {
        return vehicle.price <= budget && 
               vehicle.purpose.includes(purpose) && 
               vehicle.seats >= passengers;
    });
    
    // 排序（价格从低到高）
    recommended.sort((a, b) => a.price - b.price);
    
    // 显示结果（最多6个）
    displayResults(recommended.slice(0, 6), t);
}

function displayResults(vehicles, t) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    
    if (vehicles.length === 0) {
        container.innerHTML = `<p class="no-results">No vehicles found matching your criteria. Try adjusting your budget or requirements.</p>`;
        return;
    }
    
    vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        
        // 生成推荐理由
        const reason = generateRecommendationReason(vehicle, t);
        
        card.innerHTML = `
            <div class="vehicle-image">
                <div class="image-placeholder">${vehicle.brand} ${vehicle.model}</div>
            </div>
            <div class="vehicle-details">
                <h3 class="vehicle-title">${vehicle.brand} ${vehicle.model}</h3>
                <div class="vehicle-price">RM ${vehicle.price.toLocaleString()}</div>
                
                <div class="vehicle-specs">
                    <div class="spec-item">
                        <div class="spec-label">${t.seats}</div>
                        <div class="spec-value">${vehicle.seats}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">${t.fuel}</div>
                        <div class="spec-value">${vehicle.fuel}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">${t.maintenance}</div>
                        <div class="spec-value">${'★'.repeat(vehicle.maintenance)}</div>
                    </div>
                </div>
                
                <div class="recommendation-reason">
                    <strong>${t.reason}</strong> ${reason}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function generateRecommendationReason(vehicle, t) {
    const reasons = {
        en: [
            `Great value for your budget with excellent fuel efficiency.`,
            `Perfect for ${vehicle.purpose.join('/')} needs with its ${vehicle.type} design.`,
            `Low maintenance costs make it economical for long-term ownership.`,
            `Spacious interior comfortably seats ${vehicle.seats} passengers.`,
            `Reliable performance with strong resale value in Malaysia.`
        ],
        zh: [
            `在您的预算范围内提供卓越的燃油效率。`,
            `完美的${vehicle.purpose.join('/')}需求，采用${vehicle.type}设计。`,
            `维护成本低，长期拥有经济实惠。`,
            `宽敞的内部空间，可舒适容纳${vehicle.seats}名乘客。`,
            `可靠性能，在马来西亚具有强劲的二手价值。`
        ],
        ms: [
            `Nilai hebat untuk bajet anda dengan kecekapan bahan api yang cemerlang.`,
            `Sempurna untuk keperluan ${vehicle.purpose.join('/')} dengan reka bentuk ${vehicle.type}.`,
            `Kos penyelenggaraan rendah menjadikannya ekonomik untuk pemilikan jangka panjang.`,
            `Pedalaman luas selesa untuk ${vehicle.seats} penumpang.`,
            `Prestasi yang boleh dipercayai dengan nilai jual semula yang kukuh di Malaysia.`
        ]
    };
    
    const langReasons = reasons[t.lang || 'en'];
    return langReasons[Math.floor(Math.random() * langReasons.length)];
}

// ===== Google Analytics 集成 =====
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // 替换为您的跟踪ID
