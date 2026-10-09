// ==UserScript==
// @name         Работный Калькулятор
// @namespace    https://smartway.today/
// @version      1.0
// @description  Калькулятор для расчёта трансферов, страховок, валюты и отмены
// @author       Smartway
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/HorrorStoryy/rabotny-calculator/main/rabotny-calculator.meta.js
// @downloadURL  https://raw.githubusercontent.com/HorrorStoryy/rabotny-calculator/main/rabotny-calculator.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Иконки Unicode
    var ICON_CALC = '\uD83E\uDDEE';
    var ICON_CLOSE = '\u2715';
    var ICON_BRIEF = '\uD83D\uDCBC';
    var ICON_SHIELD = '\uD83D\uDEE1\uFE0F';
    var ICON_CURRENCY = '\uD83D\uDCB1';
    var ICON_CALENDAR = '\uD83D\uDCC5';
    var ICON_WRENCH = '\uD83D\uDD27';
    var ICON_INFO = '\u2139\uFE0F';

    // === СТИЛИ ===
    var STYLES = [
        ':root {',
        '  --rc-purple-50: #FAFAF8;',
        '  --rc-purple-100: #F5F2F0;',
        '  --rc-purple-200: #EDE8E5;',
        '  --rc-purple-300: #C6AFC6;',
        '  --rc-purple-400: #9C93B5;',
        '  --rc-text-dark: #2D2623;',
        '  --rc-text-light: #7A6F8A;',
        '  --rc-accent: #C6AFC6;',
        '}',
        '#rabotny-calc-panel {',
        '  position: fixed; top: 80px; right: 20px; z-index: 999999;',
        '  width: 420px; max-height: 70vh; background: var(--rc-purple-50);',
        '  border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2);',
        '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
        '  display: flex; flex-direction: column; overflow: hidden;',
        '  border: 1px solid var(--rc-purple-200); color: var(--rc-text-dark);',
        '}',
        '#rabotny-calc-panel .rc-header {',
        '  background: var(--rc-purple-400); color: var(--rc-purple-50);',
        '  padding: 12px 16px; display: flex; justify-content: space-between;',
        '  align-items: center; cursor: move; user-select: none;',
        '}',
        '#rabotny-calc-panel .rc-header-title { font-weight: bold; font-size: 16px; }',
        '#rabotny-calc-panel .rc-close {',
        '  background: none; border: none; color: var(--rc-purple-50);',
        '  font-size: 20px; cursor: pointer;',
        '}',
        '#rabotny-calc-panel .rc-tab-nav {',
        '  display: flex; gap: 6px; padding: 10px 12px;',
        '  background: var(--rc-purple-100); border-bottom: 1px solid var(--rc-purple-200);',
        '  flex-wrap: wrap;',
        '}',
        '#rabotny-calc-panel .rc-tab-btn {',
        '  padding: 6px 10px; border: 1px solid var(--rc-purple-200);',
        '  background: transparent; color: var(--rc-text-light);',
        '  border-radius: 6px; cursor: pointer; font-size: 12px;',
        '  font-weight: 500; transition: all 0.2s; flex: 1; white-space: nowrap;',
        '}',
        '#rabotny-calc-panel .rc-tab-btn.active {',
        '  background: var(--rc-purple-400); color: var(--rc-purple-50);',
        '  border-color: var(--rc-purple-400);',
        '}',
        '#rabotny-calc-panel .rc-tab-btn:hover { border-color: var(--rc-purple-400); }',
        '#rabotny-calc-panel .rc-tab-content { display: none; }',
        '#rabotny-calc-panel .rc-tab-content.active { display: block; }',
        '#rabotny-calc-panel .rc-body {',
        '  padding: 16px; overflow-y: auto; flex: 1;',
        '  max-height: calc(70vh - 120px);',
        '}',
        '#rabotny-calc-panel .rc-form-group { margin-bottom: 14px; }',
        '#rabotny-calc-panel .rc-form-label {',
        '  display: block; font-size: 13px; font-weight: 500;',
        '  color: var(--rc-text-dark); margin-bottom: 6px;',
        '}',
        '#rabotny-calc-panel .rc-form-input, #rabotny-calc-panel .rc-form-select {',
        '  width: 100%; padding: 10px; border: 1px solid var(--rc-purple-200);',
        '  border-radius: 6px; font-size: 14px; background: #FEFDFB;',
        '  color: var(--rc-text-dark); box-sizing: border-box;',
        '}',
        '#rabotny-calc-panel .rc-form-input:focus, #rabotny-calc-panel .rc-form-select:focus {',
        '  outline: none; border-color: var(--rc-accent); background: #FFFCF9;',
        '}',
        '#rabotny-calc-panel .rc-input-row {',
        '  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;',
        '}',
        '#rabotny-calc-panel .rc-result-box {',
        '  background: #F9F6F3; border: 2px solid var(--rc-accent);',
        '  border-radius: 8px; padding: 12px; margin-top: 12px;',
        '}',
        '#rabotny-calc-panel .rc-result-item {',
        '  display: flex; justify-content: space-between; align-items: center;',
        '  padding: 10px 0; border-bottom: 1px solid var(--rc-purple-100);',
        '  font-size: 13px;',
        '}',
        '#rabotny-calc-panel .rc-result-item:last-child { border-bottom: none; }',
        '#rabotny-calc-panel .rc-result-label { color: var(--rc-text-dark); font-weight: 500; }',
        '#rabotny-calc-panel .rc-result-value {',
        '  font-weight: 600; color: var(--rc-purple-400); font-size: 15px;',
        '}',
        '#rabotny-calc-panel .rc-result-value.highlight {',
        '  color: var(--rc-accent); font-size: 18px;',
        '}',
        '#rabotny-calc-panel .rc-info-text {',
        '  font-size: 12px; color: var(--rc-text-dark); background: var(--rc-purple-100);',
        '  padding: 10px; border-radius: 6px; margin-top: 10px; line-height: 1.5;',
        '}',
        '#rabotny-calc-panel .rc-calc-label {',
        '  display: inline-block; background: var(--rc-purple-100);',
        '  padding: 3px 6px; border-radius: 4px; font-size: 10px;',
        '  font-weight: 600; color: var(--rc-purple-400); margin-bottom: 4px;',
        '}',
        '#rabotny-calc-panel .rc-separator {',
        '  height: 1px; background: var(--rc-purple-200); margin: 12px 0; opacity: 0.3;',
        '}'
    ].join('\n');

    // === HTML РАЗМЕТКА ===
    var HTML = [
        '<div id="rabotny-calc-panel">',
        '  <div class="rc-header">',
        '    <span class="rc-header-title">' + ICON_CALC + ' Работный Калькулятор</span>',
        '    <button id="rc-close" class="rc-close">' + ICON_CLOSE + '</button>',
        '  </div>',
        '  <div class="rc-tab-nav">',
        '    <button class="rc-tab-btn active" data-tab="transfers">' + ICON_BRIEF + ' Трансферы</button>',
        '    <button class="rc-tab-btn" data-tab="insurance">' + ICON_SHIELD + ' Страховки</button>',
        '    <button class="rc-tab-btn" data-tab="currency">' + ICON_CURRENCY + ' Валюта</button>',
        '    <button class="rc-tab-btn" data-tab="cancellation">' + ICON_CALENDAR + ' Отмена</button>',
        '    <button class="rc-tab-btn" data-tab="universal">' + ICON_WRENCH + ' Универсальные</button>',
        '  </div>',
        '  <div class="rc-body">',

        // Вкладка: Трансферы
        '    <div id="transfers" class="rc-tab-content active">',
        '      <div class="rc-form-group">',
        '        <span class="rc-calc-label">' + ICON_BRIEF + ' Трансфер с наценкой</span>',
        '        <label class="rc-form-label">Выберите партнёра</label>',
        '        <select id="transfer-partner-select" class="rc-form-select">',
        '          <option value="">-- Выберите --</option>',
        '          <option value="iway" data-fee="10">Iway</option>',
        '          <option value="buytheway" data-fee="12">Buy the Way</option>',
        '          <option value="rustransfer" data-fee="8">РусТрансфер</option>',
        '          <option value="bestservice" data-fee="15">Best Service</option>',
        '          <option value="busfer" data-fee="10">Busfer</option>',
        '        </select>',
        '      </div>',
        '      <div class="rc-form-group">',
        '        <label class="rc-form-label">Сумма от партнёра (руб)</label>',
        '        <input type="number" id="transfer-price" class="rc-form-input" placeholder="0">',
        '      </div>',
        '      <div class="rc-form-group">',
        '        <label class="rc-form-label">Агентское вознаграждение (%)</label>',
        '        <input type="number" id="transfer-fee-percent" class="rc-form-input" placeholder="0">',
        '      </div>',
        '      <div class="rc-form-group">',
        '        <label class="rc-form-label">Наша наценка</label>',
        '        <input type="text" id="transfer-markup-preview" class="rc-form-input" placeholder="—" readonly>',
        '      </div>',
        '      <div class="rc-result-box">',
        '        <div class="rc-result-item"><span class="rc-result-label">Цена базовое значение</span><span class="rc-result-value" id="transfer-base-price">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Плата (fee)</span><span class="rc-result-value" id="transfer-fee-value">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Наценка Smartway</span><span class="rc-result-value" id="transfer-markup-value">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Итоговая сумма</span><span class="rc-result-value highlight" id="transfer-final">-</span></div>',
        '      </div>',
        '    </div>',

        // Вкладка: Страховки
        '    <div id="insurance" class="rc-tab-content">',
        '      <div class="rc-form-group">',
        '        <span class="rc-calc-label">' + ICON_SHIELD + ' ВЗР (70/30%)</span>',
        '        <label class="rc-form-label">Цена партнёра (руб)</label>',
        '        <input type="number" id="insurance-partner" class="rc-form-input" placeholder="0">',
        '      </div>',
        '      <div class="rc-result-box">',
        '        <div class="rc-result-item"><span class="rc-result-label">Доля партнёра (70%)</span><span class="rc-result-value" id="ins-vzr-partner">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Наша доля (30%)</span><span class="rc-result-value" id="ins-vzr-our">-</span></div>',
        '      </div>',
        '      <div class="rc-separator"></div>',
        '      <div class="rc-form-group">',
        '        <span class="rc-calc-label">Страховка к билету (50/50%)</span>',
        '        <label class="rc-form-label">Цена партнёра (руб)</label>',
        '        <input type="number" id="insurance-ticket" class="rc-form-input" placeholder="0">',
        '      </div>',
        '      <div class="rc-result-box">',
        '        <div class="rc-result-item"><span class="rc-result-label">Наша доля (50%)</span><span class="rc-result-value" id="ins-ticket-our">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Агенская доля (50%)</span><span class="rc-result-value" id="ins-ticket-agency">-</span></div>',
        '      </div>',
        '    </div>',

        // Вкладка: Валюта
        '    <div id="currency" class="rc-tab-content">',
        '      <div class="rc-form-group">',
        '        <span class="rc-calc-label">' + ICON_CURRENCY + ' Конвертация валют</span>',
        '        <label class="rc-form-label">Цена в валюте</label>',
        '        <input type="number" id="currency-price" class="rc-form-input" placeholder="0">',
        '      </div>',
        '      <div class="rc-form-group">',
        '        <label class="rc-form-label">Курс валюты к руб</label>',
        '        <input type="number" id="currency-rate" class="rc-form-input" placeholder="1" step="0.01">',
        '      </div>',
        '      <div class="rc-input-row">',
        '        <div class="rc-form-group">',
        '          <label class="rc-form-label">% конвертации партнёра</label>',
        '          <input type="number" id="currency-partner-pct" class="rc-form-input" placeholder="0" step="0.1">',
        '        </div>',
        '        <div class="rc-form-group">',
        '          <label class="rc-form-label">% колебаний (наши)</label>',
        '          <input type="number" id="currency-our-pct" class="rc-form-input" placeholder="0" step="0.1">',
        '        </div>',
        '      </div>',
        '      <div class="rc-form-group">',
        '        <label class="rc-form-label">Наша наценка (%)</label>',
        '        <input type="number" id="currency-markup" class="rc-form-input" placeholder="0" step="0.1">',
        '      </div>',
        '      <div class="rc-result-box">',
        '        <div class="rc-result-item"><span class="rc-result-label">Базовая цена (руб)</span><span class="rc-result-value" id="curr-base">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">+ Конвертация партнёра</span><span class="rc-result-value" id="curr-partner-comm">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Итого после конвертации</span><span class="rc-result-value" id="curr-after-partner">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">+ Колебания SW</span><span class="rc-result-value" id="curr-sw-comm">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Итого после колебаний</span><span class="rc-result-value" id="curr-after-sw">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">+ Наша наценка</span><span class="rc-result-value" id="curr-markup">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Итоговая цена</span><span class="rc-result-value highlight" id="curr-final">-</span></div>',
        '      </div>',
        '      <div class="rc-info-text">' + ICON_INFO + ' Механика: базовая (цена × курс) → + % конвертации партнёра → + % колебаний → + наша наценка.</div>',
        '    </div>',

        // Вкладка: Отмена
        '    <div id="cancellation" class="rc-tab-content">',
        '      <div class="rc-form-group">',
        '        <span class="rc-calc-label">' + ICON_CALENDAR + ' Время отмены</span>',
        '      </div>',
        '      <div class="rc-input-row">',
        '        <div class="rc-form-group">',
        '          <label class="rc-form-label">Дата подачи</label>',
        '          <input type="date" id="cancel-date" class="rc-form-input">',
        '        </div>',
        '        <div class="rc-form-group">',
        '          <label class="rc-form-label">Время подачи</label>',
        '          <input type="time" id="cancel-time" class="rc-form-input">',
        '        </div>',
        '      </div>',
        '      <div class="rc-form-group">',
        '        <label class="rc-form-label">Часы отмены</label>',
        '        <input type="number" id="cancel-hours" class="rc-form-input" placeholder="0" step="1">',
        '      </div>',
        '      <div class="rc-result-box">',
        '        <div class="rc-result-item"><span class="rc-result-label">Бесплатная отмена и изменение</span><span class="rc-result-value highlight" id="cancel-deadline">-</span></div>',
        '      </div>',
        '    </div>',

        // Вкладка: Универсальные
        '    <div id="universal" class="rc-tab-content">',
        '      <div class="rc-form-group">',
        '        <span class="rc-calc-label">' + ICON_WRENCH + ' Универсальные</span>',
        '        <label class="rc-form-label">Сумма от партнёра (руб)</label>',
        '        <input type="number" id="universal-partner-sum" class="rc-form-input" placeholder="0">',
        '      </div>',
        '      <div class="rc-form-group">',
        '        <label class="rc-form-label">Наша наценка (%)</label>',
        '        <input type="number" id="universal-markup-pct" class="rc-form-input" placeholder="0" step="0.1">',
        '      </div>',
        '      <div class="rc-result-box">',
        '        <div class="rc-result-item"><span class="rc-result-label">Цена партнёра</span><span class="rc-result-value" id="universal-partner-price">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Наша наценка</span><span class="rc-result-value" id="universal-markup-value">-</span></div>',
        '        <div class="rc-result-item"><span class="rc-result-label">Итого</span><span class="rc-result-value highlight" id="universal-total">-</span></div>',
        '      </div>',
        '    </div>',

        '  </div>',
        '</div>'
    ].join('\n');

    // === СОЗДАНИЕ КНОПКИ-ТРИГГЕРА ===
    function createToggleButton() {
        var oldBtn = document.getElementById('rabotny-toggle');
        if (oldBtn) oldBtn.remove();
        var toggle = document.createElement('button');
        toggle.id = 'rabotny-toggle';
        toggle.textContent = ICON_CALC;
        toggle.title = 'Работный Калькулятор';
        toggle.style.cssText = 'position:fixed;top:160px;right:20px;z-index:999999;background:#9C93B5;color:#fff;border:none;border-radius:50%;width:50px;height:50px;font-size:24px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.3);transition:0.2s;display:flex;align-items:center;justify-content:center;opacity:0.9;';
        toggle.onmouseover = function() { this.style.opacity = '1'; this.style.transform = 'scale(1.05)'; };
        toggle.onmouseout = function() { this.style.opacity = '0.9'; this.style.transform = 'scale(1)'; };
        toggle.onclick = function() {
            var panel = document.getElementById('rabotny-calc-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            } else {
                createPanel();
            }
        };
        document.body.appendChild(toggle);
        console.log('[RC] Кнопка калькулятора создана');
    }

    // === СОЗДАНИЕ ПАНЕЛИ ===
    function createPanel() {
        var styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        var temp = document.createElement('div');
        temp.innerHTML = HTML;
        var panel = temp.firstChild;
        document.body.appendChild(panel);

        setupTabButtons();
        setupTransferListeners();
        setupInsuranceListeners();
        setupCurrencyListeners();
        setupCancellationListeners();
        setupUniversalListeners();

        document.getElementById('rc-close').onclick = function() {
            panel.style.display = 'none';
        };

        var header = panel.querySelector('.rc-header');
        var isDragging = false, offsetX = 0, offsetY = 0;
        header.addEventListener('mousedown', function(e) {
            isDragging = true;
            var rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            panel.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            var left = e.clientX - offsetX;
            var top = e.clientY - offsetY;
            left = Math.max(10, Math.min(window.innerWidth - panel.offsetWidth - 10, left));
            top = Math.max(10, Math.min(window.innerHeight - panel.offsetHeight - 10, top));
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.right = 'auto';
        });
        document.addEventListener('mouseup', function() {
            if (isDragging) { isDragging = false; panel.style.cursor = 'default'; }
        });

        console.log('[RC] Панель калькулятора создана');
    }

    // === ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ===
    function setupTabButtons() {
        var buttons = document.querySelectorAll('#rabotny-calc-panel .rc-tab-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {
                switchTab(this.getAttribute('data-tab'));
            });
        }
    }

    function switchTab(tabName) {
        var contents = document.querySelectorAll('#rabotny-calc-panel .rc-tab-content');
        for (var i = 0; i < contents.length; i++) contents[i].classList.remove('active');
        var buttons = document.querySelectorAll('#rabotny-calc-panel .rc-tab-btn');
        for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
        document.getElementById(tabName).classList.add('active');
        var activeBtn = document.querySelector('#rabotny-calc-panel [data-tab="' + tabName + '"]');
        if (activeBtn) activeBtn.classList.add('active');
    }

    // === ТРАНСФЕРЫ ===
    function setupTransferListeners() {
        var partnerSelect = document.getElementById('transfer-partner-select');
        var priceInput = document.getElementById('transfer-price');
        if (partnerSelect) partnerSelect.addEventListener('change', updatePartnerFee);
        if (priceInput) priceInput.addEventListener('input', updateMarkupPreview);
    }

    function updatePartnerFee() {
        var select = document.getElementById('transfer-partner-select');
        var selectedOption = select.options[select.selectedIndex];
        var fee = selectedOption.getAttribute('data-fee');
        document.getElementById('transfer-fee-percent').value = fee || '';
        updateMarkupPreview();
    }

    function updateMarkupPreview() {
        var price = parseFloat(document.getElementById('transfer-price').value) || 0;
        var feePercent = parseFloat(document.getElementById('transfer-fee-percent').value) || 0;
        var previewField = document.getElementById('transfer-markup-preview');
        if (price === 0 || !feePercent) {
            previewField.value = '';
            clearTransferResults();
            return;
        }
        if (price >= 2500) {
            var markup = price * 0.1;
            previewField.value = markup.toFixed(2) + ' ₽ (10%)';
        } else {
            previewField.value = '250 ₽ (фиксировано)';
        }
        calculateTransferAuto();
    }

    function calculateTransferAuto() {
        var price = parseFloat(document.getElementById('transfer-price').value) || 0;
        var feePercent = parseFloat(document.getElementById('transfer-fee-percent').value) || 0;
        if (!price || !feePercent) return;
        var feeAmount = price * (feePercent / 100);
        var basePrice = price - feeAmount;
        var markup;
        if (price >= 2500) {
            markup = price * 0.1;
        } else {
            markup = 250;
        }
        var finalPrice = basePrice + feeAmount + markup;
        document.getElementById('transfer-base-price').textContent = basePrice.toFixed(2) + ' ₽';
        document.getElementById('transfer-fee-value').textContent = feeAmount.toFixed(2) + ' ₽';
        document.getElementById('transfer-markup-value').textContent = markup.toFixed(2) + ' ₽';
        document.getElementById('transfer-final').textContent = finalPrice.toFixed(2) + ' ₽';
    }

    function clearTransferResults() {
        document.getElementById('transfer-base-price').textContent = '-';
        document.getElementById('transfer-fee-value').textContent = '-';
        document.getElementById('transfer-markup-value').textContent = '-';
        document.getElementById('transfer-final').textContent = '-';
    }

    // === СТРАХОВКИ ===
    function setupInsuranceListeners() {
        var partnerInput = document.getElementById('insurance-partner');
        var ticketInput = document.getElementById('insurance-ticket');
        if (partnerInput) partnerInput.addEventListener('input', calculateInsuranceVZRAuto);
        if (ticketInput) ticketInput.addEventListener('input', calculateInsuranceTicketAuto);
    }

    function calculateInsuranceVZRAuto() {
        var partnerPrice = parseFloat(document.getElementById('insurance-partner').value) || 0;
        if (!partnerPrice) {
            document.getElementById('ins-vzr-partner').textContent = '-';
            document.getElementById('ins-vzr-our').textContent = '-';
            return;
        }
        var partnerShare = partnerPrice * 0.7;
        var ourShare = partnerPrice * 0.3;
        document.getElementById('ins-vzr-partner').textContent = partnerShare.toFixed(2) + ' ₽';
        document.getElementById('ins-vzr-our').textContent = ourShare.toFixed(2) + ' ₽';
    }

    function calculateInsuranceTicketAuto() {
        var partnerPrice = parseFloat(document.getElementById('insurance-ticket').value) || 0;
        if (!partnerPrice) {
            document.getElementById('ins-ticket-our').textContent = '-';
            document.getElementById('ins-ticket-agency').textContent = '-';
            return;
        }
        var ourShare = partnerPrice * 0.5;
        var agencyShare = partnerPrice * 0.5;
        document.getElementById('ins-ticket-our').textContent = ourShare.toFixed(2) + ' ₽';
        document.getElementById('ins-ticket-agency').textContent = agencyShare.toFixed(2) + ' ₽';
    }

    // === ВАЛЮТА ===
    function setupCurrencyListeners() {
        var ids = ['currency-price', 'currency-rate', 'currency-partner-pct', 'currency-our-pct', 'currency-markup'];
        for (var i = 0; i < ids.length; i++) {
            var el = document.getElementById(ids[i]);
            if (el) el.addEventListener('input', calculateCurrencyAuto);
        }
    }

    function calculateCurrencyAuto() {
        var price = parseFloat(document.getElementById('currency-price').value) || 0;
        var rate = parseFloat(document.getElementById('currency-rate').value) || 1;
        var partnerPct = parseFloat(document.getElementById('currency-partner-pct').value) || 0;
        var ourPct = parseFloat(document.getElementById('currency-our-pct').value) || 0;
        var markupPct = parseFloat(document.getElementById('currency-markup').value) || 0;
        if (!price || !rate) {
            document.getElementById('curr-base').textContent = '-';
            document.getElementById('curr-partner-comm').textContent = '-';
            document.getElementById('curr-after-partner').textContent = '-';
            document.getElementById('curr-sw-comm').textContent = '-';
            document.getElementById('curr-after-sw').textContent = '-';
            document.getElementById('curr-markup').textContent = '-';
            document.getElementById('curr-final').textContent = '-';
            return;
        }
        var basePrice = price * rate;
        var partnerComm = basePrice * (partnerPct / 100);
        var afterPartner = basePrice + partnerComm;
        var swComm = afterPartner * (ourPct / 100);
        var afterSw = afterPartner + swComm;
        var markupValue = afterSw * (markupPct / 100);
        var finalPrice = afterSw + markupValue;
        document.getElementById('curr-base').textContent = basePrice.toFixed(2) + ' ₽';
        document.getElementById('curr-partner-comm').textContent = partnerComm.toFixed(2) + ' ₽';
        document.getElementById('curr-after-partner').textContent = afterPartner.toFixed(2) + ' ₽';
        document.getElementById('curr-sw-comm').textContent = swComm.toFixed(2) + ' ₽';
        document.getElementById('curr-after-sw').textContent = afterSw.toFixed(2) + ' ₽';
        document.getElementById('curr-markup').textContent = markupValue.toFixed(2) + ' ₽';
        document.getElementById('curr-final').textContent = finalPrice.toFixed(2) + ' ₽';
    }

    // === ОТМЕНА ===
    function setupCancellationListeners() {
        var ids = ['cancel-date', 'cancel-time', 'cancel-hours'];
        for (var i = 0; i < ids.length; i++) {
            var el = document.getElementById(ids[i]);
            if (el) el.addEventListener('input', calculateCancellationAuto);
        }
    }

    function calculateCancellationAuto() {
        var date = document.getElementById('cancel-date').value;
        var time = document.getElementById('cancel-time').value;
        var hours = parseFloat(document.getElementById('cancel-hours').value) || 0;
        if (!date || !time || !hours) {
            document.getElementById('cancel-deadline').textContent = '-';
            return;
        }
        var submittedDate = new Date(date + 'T' + time);
        var deadlineDate = new Date(submittedDate);
        deadlineDate.setHours(deadlineDate.getHours() - hours);
        var day = String(deadlineDate.getDate()).padStart(2, '0');
        var month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        var year = deadlineDate.getFullYear();
        var hour = String(deadlineDate.getHours()).padStart(2, '0');
        var minute = String(deadlineDate.getMinutes()).padStart(2, '0');
        document.getElementById('cancel-deadline').textContent = day + '.' + month + '.' + year + ' до ' + hour + ':' + minute;
    }

    // === УНИВЕРСАЛЬНЫЕ ===
    function setupUniversalListeners() {
        var sumInput = document.getElementById('universal-partner-sum');
        var markupInput = document.getElementById('universal-markup-pct');
        if (sumInput) sumInput.addEventListener('input', calculateUniversalAuto);
        if (markupInput) markupInput.addEventListener('input', calculateUniversalAuto);
    }

    function calculateUniversalAuto() {
        var partnerSum = parseFloat(document.getElementById('universal-partner-sum').value) || 0;
        var markupPct = parseFloat(document.getElementById('universal-markup-pct').value) || 0;
        if (!partnerSum || !markupPct) {
            document.getElementById('universal-partner-price').textContent = '-';
            document.getElementById('universal-markup-value').textContent = '-';
            document.getElementById('universal-total').textContent = '-';
            return;
        }
        var markupValue = partnerSum * (markupPct / 100);
        var total = partnerSum + markupValue;
        document.getElementById('universal-partner-price').textContent = partnerSum.toFixed(2) + ' ₽';
        document.getElementById('universal-markup-value').textContent = markupValue.toFixed(2) + ' ₽';
        document.getElementById('universal-total').textContent = total.toFixed(2) + ' ₽';
    }

    // === ИНИЦИАЛИЗАЦИЯ ===
    function init() {
        console.log('[RC] Работный Калькулятор загружен');
        createToggleButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();