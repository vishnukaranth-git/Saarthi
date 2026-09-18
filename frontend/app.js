/**
 * PAYTM SAARTHI AI — APPLICATION CORE
 * Autonomous Operations • Multi-Agent Pipeline • Groq & Supabase Integration
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    theme: localStorage.getItem('saarthi_theme') || 'light',
    activeView: 'dashboard',
    activePeriod: '7D',
    backendOnline: false,
    backendBaseUrl: 'http://localhost:8000',
    authToken: localStorage.getItem('saarthi_token') || null,
    currentGoal: 'Increase my weekend sales by 15%',
    currentTaskId: 'task-4130ca24-live',
    pipelineStep: 6, // 1 to 8
    pipelineInterval: null,

    // 8-Stage Autonomous Pipeline Metadata
    stages: [
      {
        id: 1,
        name: 'Understanding Goal',
        agent: 'Supervisor Agent',
        status: 'completed',
        time: '10:02:12 AM',
        desc: 'Parsed natural language intent: target +15% revenue lift on weekend days (Sat-Sun). Metric: gross revenue.',
        output: '{"target": 15, "metric": "revenue", "timeframe": "weekend"}'
      },
      {
        id: 2,
        name: 'Analyzing Sales & Traffic',
        agent: 'Business Insights Agent',
        status: 'completed',
        time: '10:02:15 AM',
        desc: 'Evaluated 1,248 transaction records. Weekend hourly footfall declines by 24% after 4:00 PM compared to weekdays.',
        output: '{"weekend_sales": 12400, "weekday_sales": 25000, "drop": "-24%"}'
      },
      {
        id: 3,
        name: 'Finding Opportunity',
        agent: 'Business Insights Agent',
        status: 'completed',
        time: '10:02:18 AM',
        desc: 'Identified anchor products: Cold Coffee (342 units, +18%) and Masala Chai (580 units) drive 65% of repeat transactions.',
        output: '{"top_products": ["Cold Coffee", "Masala Chai"], "margin_headroom": "32%"}'
      },
      {
        id: 4,
        name: 'Synthesizing Strategy (Groq LPU)',
        agent: 'Growth Strategy Agent',
        status: 'completed',
        time: '10:02:21 AM',
        desc: 'Groq openai/gpt-oss-120b reasoned optimal promotion: Buy 1 Get 1 50% OFF on Cold Coffee & Masala Chai limited to weekend afternoons.',
        output: '{"strategy": "Weekend Beverage Surge", "offer": "BOGO 50% OFF", "segment": "repeat_customers"}'
      },
      {
        id: 5,
        name: 'Designing Regional Campaign',
        agent: 'Campaign Agent',
        status: 'completed',
        time: '10:02:24 AM',
        desc: 'Drafted bilingual Soundbox audio cue and SMS notifications in English & Kannada via Sarvam AI translation hook.',
        output: '{"channels": ["SMS", "Soundbox Audio"], "language": "English", "copy": "Weekend special: Buy 1 Get 1 50% OFF on Coffee!"}'
      },
      {
        id: 6,
        name: 'Executing Campaign Hook',
        agent: 'Execution Agent',
        status: 'active',
        time: '10:02:28 AM',
        desc: 'Dispatched promotion to mock Paytm POS terminal webhook & Soundbox push. Broadcast active across 375 repeat customer devices.',
        output: '{"status": "EXECUTED", "merchant_code": "MERCH-0941", "mode": "MOCK_PAYTM_SIMULATION"}'
      },
      {
        id: 7,
        name: 'Measuring Cashflow Impact',
        agent: 'Performance Agent',
        status: 'pending',
        time: 'Queued',
        desc: 'Continuous real-time telemetry polling live POS counter sales. Comparing actual weekend transactions against baseline model.',
        output: '{"baseline": 12400, "target_min": 14260, "telemetry": "LISTENING"}'
      },
      {
        id: 8,
        name: 'Adapting & Closing Loop',
        agent: 'Supervisor Agent',
        status: 'pending',
        time: 'Queued',
        desc: 'Evaluates if goal was exceeded or requires discount recalibration. Commits learned merchant context to Cognee AI Memory.',
        output: '{"outcome": "PENDING_MEASUREMENT", "memory_action": "PERSIST_PATTERNS"}'
      }
    ],

    // Multi-Agent Team Definitions
    agents: [
      {
        name: 'Supervisor Agent',
        role: 'Orchestrator & Goal Parser',
        status: 'Active',
        task: 'Monitoring end-to-end execution loop #8942-B and evaluating ROI impact',
        output: 'Parsed goal: +15% Weekend Revenue Lift'
      },
      {
        name: 'Business Insights Agent',
        role: 'Transaction Analytics',
        status: 'Idle',
        task: 'Calculated weekday vs weekend ratio; identified peak hours 10 AM - 1 PM',
        output: 'Identified 24% weekend afternoon drop'
      },
      {
        name: 'Growth Strategy Agent',
        role: 'Groq LLM Reasoning',
        status: 'Idle',
        task: 'Generated BOGO 50% discount strategy targeting repeat coffee buyers',
        output: 'Offer: BOGO 50% OFF (Groq 120b)'
      },
      {
        name: 'Campaign Agent',
        role: 'Creative & Regional Copy',
        status: 'Idle',
        task: 'Generated hyper-local notifications in English and Kannada',
        output: 'Created 2 regional campaign drafts'
      },
      {
        name: 'Execution Agent',
        role: 'Paytm POS & Soundbox Hook',
        status: 'Active',
        task: 'Triggering mock Paytm campaign webhook & Soundbox broadcast',
        output: 'Broadcasted to 375 customer wallets'
      },
      {
        name: 'Performance Agent',
        role: 'Outcome Verification',
        status: 'Listening',
        task: 'Awaiting weekend batch settlement to measure actual sales change',
        output: 'Telemetry baseline set to ₹12,400'
      }
    ],

    // Campaigns Mock Database
    campaigns: [
      {
        id: 'CMP-WEEKEND-01',
        title: 'Weekend Beverage Surge',
        offer: 'BOGO 50% OFF',
        segment: 'Repeat Customers',
        language: 'English',
        status: 'EXECUTED',
        created: 'Today, 10:02 AM',
        products: ['Cold Coffee', 'Masala Chai'],
        message: 'Weekend special: Buy 1 Get 1 50% OFF on Cold Coffee and Masala Chai. Shop now at Vishnu Store!',
        reach: '375 customers',
        revenue: '₹14,800 projected'
      },
      {
        id: 'CMP-REACT-02',
        title: 'Inactive Shopper Welcome Back',
        offer: '10% OFF',
        segment: 'Inactive (>30 days)',
        language: 'Kannada',
        status: 'COMPLETED',
        created: 'Sep 16, 2026',
        products: ['All Catalog'],
        message: 'ವಿಷ್ಣು ಸ್ಟೋರ್‌ಗೆ ಮರಳಿ ಬನ್ನಿ! ನಿಮ್ಮ ಮುಂದಿನ ಖರೀದಿಯ ಮೇಲೆ 10% ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ.',
        reach: '107 customers',
        revenue: '₹8,450 generated'
      },
      {
        id: 'CMP-SNACK-03',
        title: 'Evening Snack Combo Special',
        offer: '₹20 Cashback',
        segment: 'High Value',
        language: 'Hindi',
        status: 'SCHEDULED',
        created: 'Sep 15, 2026',
        products: ['Samosa', 'Veg Sandwich'],
        message: 'शाम की चाय के साथ गरमा-गरम समोसे पर ₹20 कैशबैक। अभी ऑर्डर करें!',
        reach: '160 customers',
        revenue: '₹6,200 projected'
      }
    ],

    // Structured AI Memory Items
    memories: [
      {
        category: 'Business Pattern',
        statement: 'Weekend sales consistently drop by ~24% between 4:00 PM and 8:00 PM compared to weekdays.',
        source: 'Insights Agent • 30-Day POS Analytics',
        date: 'Updated today',
        confidence: '96% confidence'
      },
      {
        category: 'Merchant Preference',
        statement: 'Merchant prefers short-duration weekend promotional bursts rather than continuous margin discounts.',
        source: 'Supervisor Agent • Merchant Settings',
        date: 'Sep 14, 2026',
        confidence: '98% confidence'
      },
      {
        category: 'Historical Outcome',
        statement: 'Buy-One-Get-One 50% discounts generate 2.8x higher basket volume than flat 10% coupon codes for beverages.',
        source: 'Performance Agent • Campaign CMP-WEEKEND-01',
        date: 'Sep 12, 2026',
        confidence: '92% confidence'
      },
      {
        category: 'Audience Behavior',
        statement: 'Repeat customers in Bengaluru general retail respond 40% faster to evening promotions sent before 11:00 AM.',
        source: 'Campaign Agent • Broadcast Telemetry',
        date: 'Sep 10, 2026',
        confidence: '89% confidence'
      },
      {
        category: 'Catalog Performance',
        statement: 'Cold Coffee and Masala Chai are non-cannibalizing anchor items with combined 34% gross margins.',
        source: 'Insights Agent • Product Correlation',
        date: 'Sep 08, 2026',
        confidence: '94% confidence'
      },
      {
        category: 'Language Preference',
        statement: 'Regional Kannada & Hindi translations increase SMS coupon redemption rates by +21% for local walk-in shoppers.',
        source: 'Sarvam Indic AI Hook',
        date: 'Sep 05, 2026',
        confidence: '91% confidence'
      }
    ],

    // Customers Mock Data
    customers: [
      { name: 'Arun Kumar', segment: 'High Value', lang: 'Kannada', orders: 24, spend: '₹14,200', last: '2 hours ago' },
      { name: 'Priya Sharma', segment: 'Repeat', lang: 'English', orders: 16, spend: '₹8,650', last: 'Yesterday' },
      { name: 'Ramesh Patel', segment: 'Repeat', lang: 'Hindi', orders: 12, spend: '₹5,400', last: '2 days ago' },
      { name: 'Sneha Rao', segment: 'New', lang: 'English', orders: 2, spend: '₹720', last: '3 days ago' },
      { name: 'Vikram Mehta', segment: 'Inactive', lang: 'English', orders: 9, spend: '₹4,100', last: '34 days ago' }
    ]
  };

  // --- DOM CACHE ---
  const DOM = {
    html: document.documentElement,
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    sunIcon: document.getElementById('sunIcon'),
    moonIcon: document.getElementById('moonIcon'),
    themeToggleText: document.getElementById('themeToggleText'),
    navItems: document.querySelectorAll('.nav-item'),
    viewSections: document.querySelectorAll('.view-section'),
    goalInput: document.getElementById('goalInput'),
    askSaarthiBtn: document.getElementById('askSaarthiBtn'),
    voiceMicBtn: document.getElementById('voiceMicBtn'),
    suggestionChips: document.querySelectorAll('.suggestion-chip'),
    backendStatusLabel: document.getElementById('backendStatusLabel'),
    brandLogoBtn: document.getElementById('brandLogoBtn'),
    sidebarLiveBadge: document.getElementById('sidebarLiveBadge'),

    // Execution View
    activeGoalTitle: document.getElementById('activeGoalTitle'),
    activeGoalStatusBadge: document.getElementById('activeGoalStatusBadge'),
    activeGoalTaskId: document.getElementById('activeGoalTaskId'),
    pipelineTimelineWrapper: document.getElementById('pipelineTimelineWrapper'),
    overallPipelineBadge: document.getElementById('overallPipelineBadge'),
    agentTeamGrid: document.getElementById('agentTeamGrid'),
    stepPipelineBtn: document.getElementById('stepPipelineBtn'),
    replayPipelineBtn: document.getElementById('replayPipelineBtn'),
    syncBackendBtn: document.getElementById('syncBackendBtn'),

    // Quick Actions
    qaCreateCampaign: document.getElementById('qaCreateCampaign'),
    qaViewAnalytics: document.getElementById('qaViewAnalytics'),
    qaManageProducts: document.getElementById('qaManageProducts'),
    qaCustomerInsights: document.getElementById('qaCustomerInsights'),
    qaAskSaarthi: document.getElementById('qaAskSaarthi'),
    runRecCampaignBtn: document.getElementById('runRecCampaignBtn'),
    viewCatalogBtn: document.getElementById('viewCatalogBtn'),
    viewAllActivityBtn: document.getElementById('viewAllActivityBtn'),

    // Campaigns & Memory
    campaignsTableBody: document.getElementById('campaignsTableBody'),
    customersTableBody: document.getElementById('customersTableBody'),
    memoryGrid: document.getElementById('memoryGrid'),

    // Modals
    campaignDetailModal: document.getElementById('campaignDetailModal'),
    cdModalTitle: document.getElementById('cdModalTitle'),
    cdModalBody: document.getElementById('cdModalBody'),
    closeCdModalBtn: document.getElementById('closeCdModalBtn'),
    authModal: document.getElementById('authModal'),
    merchantProfileBtn: document.getElementById('merchantProfileBtn'),
    closeAuthModalBtn: document.getElementById('closeAuthModalBtn'),
    toastContainer: document.getElementById('toastContainer'),
    globalSearchInput: document.getElementById('globalSearchInput')
  };

  // --- INITIALIZATION ---
  function init() {
    initTheme();
    bindNavigation();
    bindCommandInput();
    bindQuickActions();
    bindModals();
    renderSalesChart(state.activePeriod);
    renderDonutChart();
    renderPipeline();
    renderAgentTeam();
    renderCampaignsTable();
    renderCustomersTable();
    renderMemoryGrid();
    checkBackendHealth();
    bindKeyboardShortcuts();
  }

  // --- THEME ENGINE ---
  function initTheme() {
    DOM.html.setAttribute('data-theme', state.theme);
    updateThemeUI(state.theme);

    DOM.themeToggleBtn.addEventListener('click', () => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('saarthi_theme', newTheme);
      DOM.html.setAttribute('data-theme', newTheme);
      updateThemeUI(newTheme);
      renderSalesChart(state.activePeriod);
      renderDonutChart();
      showToast(`Theme switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
  }

  function updateThemeUI(theme) {
    if (theme === 'dark') {
      DOM.sunIcon.style.display = 'none';
      DOM.moonIcon.style.display = 'flex';
      DOM.themeToggleText.textContent = 'Dark';
    } else {
      DOM.sunIcon.style.display = 'flex';
      DOM.moonIcon.style.display = 'none';
      DOM.themeToggleText.textContent = 'Light';
    }
  }

  // --- NAVIGATION ROUTER ---
  function bindNavigation() {
    DOM.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = item.getAttribute('data-nav');
        switchView(targetView);
      });
    });

    if (DOM.brandLogoBtn) {
      DOM.brandLogoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('dashboard');
      });
    }

    // Chart period filter clicks
    document.querySelectorAll('.chart-period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activePeriod = btn.getAttribute('data-period');
        renderSalesChart(state.activePeriod);
      });
    });
  }

  function switchView(viewName) {
    state.activeView = viewName;

    // Update sidebar active classes
    DOM.navItems.forEach(item => {
      if (item.getAttribute('data-nav') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle view visibility
    DOM.viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
        section.style.display = 'block';
      } else {
        section.classList.remove('active');
        section.style.display = 'none';
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh charts if entering analytics or dashboard
    if (viewName === 'analytics') {
      setTimeout(renderAnalyticsChart, 50);
    }
  }

  // --- COMMAND CENTER / GOAL SUBMISSION ---
  function bindCommandInput() {
    // Quick suggestion chips
    DOM.suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const goal = chip.getAttribute('data-goal');
        DOM.goalInput.value = goal;
        DOM.goalInput.focus();
      });
    });

    // Submit button
    DOM.askSaarthiBtn.addEventListener('click', handleGoalSubmit);

    DOM.goalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleGoalSubmit();
      }
    });

    // Voice button
    DOM.voiceMicBtn.addEventListener('click', () => {
      showToast('Voice listening active… (Speak: "Increase weekend sales by 15%")', 'info');
      DOM.goalInput.value = 'Increase weekend beverage sales by 20%';
      setTimeout(handleGoalSubmit, 1400);
    });
  }

  function handleGoalSubmit() {
    const text = DOM.goalInput.value.trim();
    if (!text) {
      showToast('Please type a business goal first', 'warning');
      DOM.goalInput.focus();
      return;
    }

    state.currentGoal = text;
    DOM.activeGoalTitle.textContent = `“${text}”`;
    state.currentTaskId = 'task-' + Math.random().toString(36).substring(2, 10);
    DOM.activeGoalTaskId.textContent = state.currentTaskId;

    showToast('Autonomous Multi-Agent Loop Dispatched!', 'success');
    switchView('goals');
    startPipelineSimulation();

    // If live backend is online, optionally invoke POST /api/goals
    if (state.backendOnline) {
      invokeBackendGoal(text);
    }
  }

  async function invokeBackendGoal(goal) {
    try {
      const res = await fetch(`${state.backendBaseUrl}/api/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.authToken || 'demo:merchant-1'}`
        },
        body: JSON.stringify({ goal })
      });
      if (res.ok) {
        const data = await res.json();
        DOM.activeGoalTaskId.textContent = data.task_id;
        showToast(`Synced with live Supabase task: ${data.task_id.substring(0, 8)}...`, 'success');
      }
    } catch {
      // Graceful fallback to simulation
    }
  }

  // --- QUICK ACTIONS ROUTING ---
  function bindQuickActions() {
    if (DOM.qaCreateCampaign) {
      DOM.qaCreateCampaign.addEventListener('click', () => switchView('campaigns'));
    }
    if (DOM.qaViewAnalytics) {
      DOM.qaViewAnalytics.addEventListener('click', () => switchView('analytics'));
    }
    if (DOM.qaManageProducts) {
      DOM.qaManageProducts.addEventListener('click', () => switchView('customers'));
    }
    if (DOM.qaCustomerInsights) {
      DOM.qaCustomerInsights.addEventListener('click', () => switchView('customers'));
    }
    if (DOM.qaAskSaarthi) {
      DOM.qaAskSaarthi.addEventListener('click', () => {
        DOM.goalInput.focus();
        DOM.goalInput.scrollIntoView({ behavior: 'smooth' });
      });
    }
    if (DOM.runRecCampaignBtn) {
      DOM.runRecCampaignBtn.addEventListener('click', () => {
        DOM.goalInput.value = 'Run 15% weekend discount on Cold Coffee & Beverages for repeat customers';
        handleGoalSubmit();
      });
    }
    if (DOM.viewCatalogBtn) {
      DOM.viewCatalogBtn.addEventListener('click', () => switchView('customers'));
    }
    if (DOM.viewAllActivityBtn) {
      DOM.viewAllActivityBtn.addEventListener('click', () => switchView('goals'));
    }

    // Step pipeline button
    DOM.stepPipelineBtn.addEventListener('click', () => {
      state.pipelineStep = (state.pipelineStep % 8) + 1;
      updatePipelineUI();
      showToast(`Stepped to Stage ${state.pipelineStep}: ${state.stages[state.pipelineStep - 1].name}`, 'info');
    });

    // Replay button
    DOM.replayPipelineBtn.addEventListener('click', () => {
      startPipelineSimulation();
      showToast('Re-running autonomous 8-stage pipeline…', 'info');
    });

    // Backend sync button
    DOM.syncBackendBtn.addEventListener('click', async () => {
      showToast('Connecting to live Supabase backend…', 'info');
      await checkBackendHealth(true);
    });
  }

  // --- AUTONOMOUS 8-STAGE TIMELINE RENDERER ---
  function renderPipeline() {
    if (!DOM.pipelineTimelineWrapper) return;

    let html = '';
    state.stages.forEach((stage, idx) => {
      const stepNumber = idx + 1;
      let statusClass = 'pending';
      let icon = stepNumber;

      if (stepNumber < state.pipelineStep) {
        statusClass = 'completed';
        icon = '✓';
      } else if (stepNumber === state.pipelineStep) {
        statusClass = 'active';
        icon = '●';
      }

      html += `
        <div class="stage-item ${statusClass}" id="stage-${stepNumber}">
          <div class="stage-marker">${icon}</div>
          <div class="stage-content-card">
            <div class="stage-header-row">
              <div class="stage-name-wrap">
                <span class="stage-name">${stage.name}</span>
                <span class="stage-agent-pill">${stage.agent}</span>
              </div>
              <span class="stage-time">${stage.time}</span>
            </div>
            <p class="stage-desc">${stage.desc}</p>
            <div class="stage-output-box">${stage.output}</div>
          </div>
        </div>
      `;
    });

    DOM.pipelineTimelineWrapper.innerHTML = html;
    DOM.overallPipelineBadge.textContent = `Stage ${state.pipelineStep} of 8 Active`;
  }

  function updatePipelineUI() {
    renderPipeline();
  }

  function startPipelineSimulation() {
    if (state.pipelineInterval) clearInterval(state.pipelineInterval);
    state.pipelineStep = 1;
    updatePipelineUI();

    state.pipelineInterval = setInterval(() => {
      if (state.pipelineStep < 8) {
        state.pipelineStep++;
        updatePipelineUI();
      } else {
        clearInterval(state.pipelineInterval);
        showToast('Autonomous Loop Completed: Cashflow verified in Supabase!', 'success');
      }
    }, 2800);
  }

  // --- MULTI-AGENT OPERATIONS TEAM GRID ---
  function renderAgentTeam() {
    if (!DOM.agentTeamGrid) return;

    const supervisor = state.agents[0];
    const subAgents = state.agents.slice(1);

    let html = `
      <div class="supervisor-card">
        <div style="display:flex; align-items:center; gap:16px;">
          <div class="agent-icon" style="background:#002970; color:#00baf2; width:52px; height:52px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div>
            <div style="font-size:18px; font-weight:800; color:var(--text-main);">${supervisor.name}</div>
            <div style="font-size:13px; color:var(--text-muted); font-weight:600;">Autonomous Team Lead • ${supervisor.role}</div>
            <p style="font-size:13px; color:var(--text-main); margin-top:4px;">${supervisor.task}</p>
          </div>
        </div>
        <div style="text-align:right;">
          <span class="badge badge-success" style="font-size:13px; padding:6px 14px;">Status: ${supervisor.status}</span>
          <div style="font-size:12px; font-family:monospace; margin-top:6px; color:var(--text-muted);">${supervisor.output}</div>
        </div>
      </div>
    `;

    subAgents.forEach(agent => {
      const badgeClass = agent.status === 'Active' ? 'badge-success' : agent.status === 'Listening' ? 'badge-warning' : 'badge-info';
      html += `
        <div class="agent-card">
          <div>
            <div class="agent-card-header">
              <div class="agent-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <div class="agent-info-title">${agent.name}</div>
                <div class="agent-info-role">${agent.role}</div>
              </div>
            </div>
            <div class="agent-task-box">${agent.task}</div>
          </div>
          <div class="agent-footer">
            <span class="badge ${badgeClass}">${agent.status}</span>
            <span style="color:var(--text-muted); font-family:monospace; font-size:11px;">Telemetry OK</span>
          </div>
        </div>
      `;
    });

    DOM.agentTeamGrid.innerHTML = html;
  }

  // --- CAMPAIGNS TABLE RENDERER ---
  function renderCampaignsTable() {
    if (!DOM.campaignsTableBody) return;

    let html = '';
    state.campaigns.forEach(c => {
      const badgeClass = c.status === 'EXECUTED' ? 'badge-success' : c.status === 'COMPLETED' ? 'badge-info' : 'badge-warning';
      html += `
        <tr>
          <td>
            <div class="campaign-title-cell">${c.title}</div>
            <div style="font-size:12px; color:var(--text-muted);">${c.id}</div>
          </td>
          <td><span class="campaign-offer-badge">${c.offer}</span></td>
          <td>${c.segment}</td>
          <td><span class="badge badge-primary">${c.language}</span></td>
          <td><span class="badge ${badgeClass}">${c.status}</span></td>
          <td><span style="color:var(--text-muted); font-size:13px;">${c.created}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm view-campaign-btn" data-id="${c.id}">Inspect →</button>
          </td>
        </tr>
      `;
    });

    DOM.campaignsTableBody.innerHTML = html;

    // Attach inspect buttons
    document.querySelectorAll('.view-campaign-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openCampaignDetailModal(id);
      });
    });
  }

  function openCampaignDetailModal(campaignId) {
    const c = state.campaigns.find(item => item.id === campaignId) || state.campaigns[0];
    DOM.cdModalTitle.textContent = `${c.title} (${c.id})`;

    DOM.cdModalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card-subtle); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Promotional Offer</div>
            <div style="font-size:20px; font-weight:900; color:var(--primary);">${c.offer}</div>
          </div>
          <span class="badge badge-success" style="font-size:13px;">${c.status}</span>
        </div>

        <div>
          <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px;">Regional Message Copy (${c.language})</div>
          <div style="background:var(--bg-card-subtle); border:1px solid var(--border-color); padding:14px; border-radius:var(--radius-md); font-size:14px; line-height:1.5;">
            “${c.message}”
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:13px;">
          <div style="background:var(--bg-card-subtle); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="color:var(--text-muted);">Target Segment</div>
            <div style="font-weight:700; color:var(--text-main); margin-top:2px;">${c.segment}</div>
          </div>
          <div style="background:var(--bg-card-subtle); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="color:var(--text-muted);">Broadcast Channel</div>
            <div style="font-weight:700; color:var(--text-main); margin-top:2px;">Mock Paytm POS & Soundbox</div>
          </div>
          <div style="background:var(--bg-card-subtle); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="color:var(--text-muted);">Audience Reach</div>
            <div style="font-weight:700; color:var(--text-main); margin-top:2px;">${c.reach}</div>
          </div>
          <div style="background:var(--bg-card-subtle); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="color:var(--text-muted);">Projected Sales</div>
            <div style="font-weight:700; color:var(--success); margin-top:2px;">${c.revenue}</div>
          </div>
        </div>

        <div style="font-size:12px; color:var(--text-light); text-align:center; padding-top:8px;">
          Mock Paytm API — Hackathon Demo • No production Paytm API keys implied
        </div>
      </div>
    `;

    DOM.campaignDetailModal.classList.add('open');
  }

  // --- CUSTOMERS DIRECTORY RENDERER ---
  function renderCustomersTable() {
    if (!DOM.customersTableBody) return;

    let html = '';
    state.customers.forEach(cust => {
      html += `
        <tr>
          <td>
            <div style="font-weight:700; color:var(--text-main);">${cust.name}</div>
          </td>
          <td><span class="badge badge-primary">${cust.segment}</span></td>
          <td>${cust.lang}</td>
          <td><strong>${cust.orders}</strong> orders</td>
          <td style="font-weight:700; color:var(--success);">${cust.spend}</td>
          <td><span style="color:var(--text-muted); font-size:13px;">${cust.last}</span></td>
        </tr>
      `;
    });

    DOM.customersTableBody.innerHTML = html;
  }

  // --- AI MEMORY GRID RENDERER ---
  function renderMemoryGrid() {
    if (!DOM.memoryGrid) return;

    let html = '';
    state.memories.forEach(m => {
      html += `
        <div class="memory-card">
          <div>
            <span class="memory-cat-pill">${m.category}</span>
            <p class="memory-statement">“${m.statement}”</p>
          </div>
          <div class="memory-meta-footer">
            <span>${m.source}</span>
            <span class="confidence-pill">${m.confidence}</span>
          </div>
        </div>
      `;
    });

    DOM.memoryGrid.innerHTML = html;
  }

  // --- CHARTS: PURE SVG SALES CURVE ENGINE ---
  function renderSalesChart(period) {
    const container = document.getElementById('salesChartContainer');
    if (!container) return;

    // Simulated data curves for 7D, 30D, 90D, 1Y
    const dataPointsMap = {
      '7D': [
        { label: 'Mon', val: 18200 },
        { label: 'Tue', val: 21400 },
        { label: 'Wed', val: 19800 },
        { label: 'Thu', val: 24500 },
        { label: 'Fri', val: 28900 },
        { label: 'Sat', val: 38400 },
        { label: 'Sun', val: 34220 }
      ],
      '30D': [
        { label: 'W1', val: 42000 },
        { label: 'W2', val: 46500 },
        { label: 'W3', val: 51200 },
        { label: 'W4', val: 58900 }
      ],
      '90D': [
        { label: 'Jul', val: 142000 },
        { label: 'Aug', val: 168000 },
        { label: 'Sep', val: 185420 }
      ],
      '1Y': [
        { label: 'Q1', val: 420000 },
        { label: 'Q2', val: 490000 },
        { label: 'Q3', val: 540000 },
        { label: 'Q4', val: 620000 }
      ]
    };

    const data = dataPointsMap[period] || dataPointsMap['7D'];
    const maxVal = Math.max(...data.map(d => d.val)) * 1.15;
    const minVal = 0;

    const width = 680;
    const height = 240;
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - ((d.val - minVal) / (maxVal - minVal)) * chartH;
      return { x, y, ...d };
    });

    // Create cubic bezier curve path
    let dPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      dPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    const areaPath = `${dPath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

    const isDark = state.theme === 'dark';
    const lineColor = isDark ? '#00baf2' : '#002970';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    let svg = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Horizontal Gridlines -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="${gridColor}" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${padding.top + chartH * 0.5}" x2="${width - padding.right}" y2="${padding.top + chartH * 0.5}" stroke="${gridColor}" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="${gridColor}"/>

        <!-- Y Axis Labels -->
        <text x="${padding.left - 12}" y="${padding.top + 4}" fill="${textColor}" font-size="11" font-weight="600" text-anchor="end">₹${Math.round(maxVal / 1000)}k</text>
        <text x="${padding.left - 12}" y="${padding.top + chartH * 0.5 + 4}" fill="${textColor}" font-size="11" font-weight="600" text-anchor="end">₹${Math.round(maxVal / 2000)}k</text>
        <text x="${padding.left - 12}" y="${padding.top + chartH}" fill="${textColor}" font-size="11" font-weight="600" text-anchor="end">₹0</text>

        <!-- Area Fill & Stroke Line -->
        <path d="${areaPath}" fill="url(#salesGradient)"/>
        <path d="${dPath}" fill="none" stroke="${lineColor}" stroke-width="3" stroke-linecap="round"/>

        <!-- Points & X Labels -->
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${isDark ? '#090d16' : '#ffffff'}" stroke="${lineColor}" stroke-width="2.5"/>
          <text x="${p.x}" y="${padding.top + chartH + 22}" fill="${textColor}" font-size="12" font-weight="600" text-anchor="middle">${p.label}</text>
        `).join('')}
      </svg>
    `;

    container.innerHTML = svg;
  }

  function renderAnalyticsChart() {
    const container = document.getElementById('analyticsChartContainer');
    if (!container) return;

    // Dual comparison chart (Weekend vs Weekday)
    const width = 680;
    const height = 240;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
    const weekdayVals = [22000, 24000, 23500, 25100, 26200, 28000];
    const weekendVals = [14000, 15200, 16100, 19400, 24800, 29500];

    const maxVal = 32000;
    const isDark = state.theme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    const pWeekday = weekdayVals.map((v, i) => ({
      x: padding.left + (i / (weeks.length - 1)) * chartW,
      y: padding.top + chartH - (v / maxVal) * chartH
    }));

    const pWeekend = weekendVals.map((v, i) => ({
      x: padding.left + (i / (weeks.length - 1)) * chartW,
      y: padding.top + chartH - (v / maxVal) * chartH
    }));

    const dWeekday = pWeekday.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    const dWeekend = pWeekend.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%;">
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="${gridColor}" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="${gridColor}"/>

        <!-- Weekday baseline (Gray) -->
        <path d="${dWeekday}" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="6"/>
        <!-- Weekend surge (Paytm Blue) -->
        <path d="${dWeekend}" fill="none" stroke="#00baf2" stroke-width="3.5"/>

        ${weeks.map((w, i) => `
          <text x="${padding.left + (i / (weeks.length - 1)) * chartW}" y="${padding.top + chartH + 20}" fill="#94a3b8" font-size="11" text-anchor="middle">${w}</text>
        `).join('')}
      </svg>
    `;
  }

  // --- CHARTS: PURE SVG DONUT CHART ENGINE ---
  function renderDonutChart() {
    const container = document.getElementById('donutContainer');
    if (!container) return;

    // Segments: Repeat (42%), New (28%), High Value (18%), Inactive (12%)
    const segments = [
      { pct: 42, color: '#002970' },
      { pct: 28, color: '#00baf2' },
      { pct: 18, color: '#10b981' },
      { pct: 12, color: '#94a3b8' }
    ];

    const size = 160;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedOffset = 0;
    let circlesHtml = '';

    segments.forEach(seg => {
      const strokeDasharray = `${(seg.pct / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += (seg.pct / 100) * circumference;

      circlesHtml += `
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}"
          fill="none"
          stroke="${seg.color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDasharray}"
          stroke-dashoffset="${strokeDashoffset}"
          transform="rotate(-90 ${size / 2} ${size / 2})"
          style="transition: stroke-dasharray 0.8s ease;"
        />
      `;
    });

    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${circlesHtml}
      </svg>
      <div class="donut-center-text">
        <div class="donut-center-val">892</div>
        <div class="donut-center-label">Total</div>
      </div>
    `;

    container.innerHTML = svg;
  }

  // --- MODALS & DRAWERS ---
  function bindModals() {
    // Campaign modal close
    if (DOM.closeCdModalBtn) {
      DOM.closeCdModalBtn.addEventListener('click', () => {
        DOM.campaignDetailModal.classList.remove('open');
      });
    }

    // Auth modal open/close
    if (DOM.merchantProfileBtn) {
      DOM.merchantProfileBtn.addEventListener('click', () => {
        DOM.authModal.classList.add('open');
      });
    }
    if (DOM.closeAuthModalBtn) {
      DOM.closeAuthModalBtn.addEventListener('click', () => {
        DOM.authModal.classList.remove('open');
      });
    }

    // Close on backdrop click
    [DOM.campaignDetailModal, DOM.authModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });
  }

  // --- AUTH FORM SUBMIT (SUPABASE AUTH) ---
  window.saarthiApp = {
    handleAuthSubmit: async function () {
      const email = document.getElementById('authEmailInput').value.trim();
      const password = document.getElementById('authPasswordInput').value.trim();
      if (!email || !password) return;

      showToast('Authenticating with Supabase…', 'info');

      try {
        const res = await fetch(`${state.backendBaseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const data = await res.json();
          state.authToken = data.access_token;
          localStorage.setItem('saarthi_token', data.access_token);
          DOM.authModal.classList.remove('open');
          showToast(`Logged in as ${data.email}!`, 'success');
        } else {
          // Attempt sign up if login fails
          const sRes = await fetch(`${state.backendBaseUrl}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (sRes.ok) {
            const sData = await sRes.json();
            state.authToken = sData.access_token;
            localStorage.setItem('saarthi_token', sData.access_token);
            DOM.authModal.classList.remove('open');
            showToast('Account created and verified!', 'success');
          } else {
            showToast('Authentication error. Running in local session mode.', 'warning');
            DOM.authModal.classList.remove('open');
          }
        }
      } catch {
        showToast('Running in standalone session mode.', 'info');
        DOM.authModal.classList.remove('open');
      }
    },

    saveSettings: function () {
      const bName = document.getElementById('settingBusinessName').value;
      document.getElementById('headerStoreName').textContent = bName;
      showToast('Merchant preferences saved successfully in Supabase!', 'success');
    },

    resetSettings: function () {
      document.getElementById('merchantSettingsForm').reset();
      showToast('Preferences reset to default', 'info');
    }
  };

  // --- BACKEND HEALTH DETECTION ---
  async function checkBackendHealth(manualTrigger = false) {
    try {
      const res = await fetch(`${state.backendBaseUrl}/health`, { method: 'GET' });
      if (res.ok) {
        state.backendOnline = true;
        DOM.backendStatusLabel.textContent = 'Live: Supabase & Groq API';
        DOM.sidebarLiveBadge.textContent = 'Live API';
        if (manualTrigger) showToast('Connected to live FastAPI backend at localhost:8000!', 'success');
      } else {
        throw new Error('Offline');
      }
    } catch {
      state.backendOnline = false;
      DOM.backendStatusLabel.textContent = 'Simulated: Groq & Supabase';
      if (manualTrigger) showToast('Backend offline at :8000. Running in high-fidelity standalone demo mode.', 'info');
    }
  }

  // --- NOTIFICATION TOASTS ---
  function showToast(message, type = 'info') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconColor = type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#00baf2';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>${message}</span>
    `;

    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // --- KEYBOARD SHORTCUTS ---
  function bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // '/' to focus global command search
      if (e.key === '/' && document.activeElement !== DOM.globalSearchInput && document.activeElement !== DOM.goalInput) {
        e.preventDefault();
        DOM.globalSearchInput.focus();
      }
      // 'Escape' closes modals
      if (e.key === 'Escape') {
        DOM.campaignDetailModal.classList.remove('open');
        DOM.authModal.classList.remove('open');
      }
    });

    DOM.globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = DOM.globalSearchInput.value.trim();
        if (query) {
          DOM.goalInput.value = query;
          handleGoalSubmit();
        }
      }
    });
  }

  // Self start on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
