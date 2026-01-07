
import React, { useState, useEffect, useCallback, useRef } from 'react';

type PageId = 'home' | 'philosophy' | 'business' | 'about';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // アニメーションを何度でも実行するためのIntersection Observerの設定
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1, // 10%が見えたら実行
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          // 画面外に出た時にクラスを外す（これで何度でも動くようになる）
          entry.target.classList.remove('visible');
        }
      });
    }, observerOptions);

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    return () => {
      reveals.forEach(el => observer.unobserve(el));
    };
  }, [currentPage]); // ページ遷移時にも再セット

  // モバイルメニューが開いている時にスクロールを防止
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  const switchPage = (pageId: PageId, anchor?: string) => {
    if (isLoading) return;
    setIsLoading(true);
    document.body.classList.add('loading');
    setIsMenuOpen(false);

    setTimeout(() => {
      setCurrentPage(pageId);
      window.scrollTo(0, 0);
      document.body.classList.remove('loading');
      setIsLoading(false);
      
      if (anchor) {
        setTimeout(() => {
          const el = document.getElementById(anchor);
          if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 300);
      }
    }, 600);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div id="page-loader"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div 
            onClick={() => switchPage('home')} 
            className="text-xl md:text-2xl font-black text-primary tracking-tighter cursor-pointer group flex items-center z-[110]"
          >
            <span className="group-hover:text-primaryLight transition-colors duration-300">O2plusNO</span>
          </div>

          <nav className="hidden lg:flex items-center space-x-10">
            {(['philosophy', 'business', 'about'] as PageId[]).map((id) => (
              <span 
                key={id}
                onClick={() => switchPage(id)} 
                className={`nav-link text-sm font-bold hover:text-primary transition-colors capitalize ${currentPage === id ? 'active-nav text-primary' : ''}`}
              >
                {id === 'business' ? 'Service' : id}
              </span>
            ))}
            <button 
              onClick={scrollToContact} 
              className="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 hover:scale-105 active:scale-95"
            >
              お問い合わせ
            </button>
          </nav>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors z-[110]"
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-white transition-all duration-500 ease-in-out z-[105] lg:hidden flex flex-col justify-center items-center text-center p-8 space-y-10 ${
            isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-full invisible'
          }`}
        >
          <div className="flex flex-col space-y-8 w-full">
            {(['home', 'philosophy', 'business', 'about'] as PageId[]).map((id) => (
              <span 
                key={id} 
                onClick={() => switchPage(id)} 
                className="text-4xl font-black cursor-pointer hover:text-primary capitalize transition-colors"
              >
                {id === 'home' ? 'Home' : id === 'business' ? 'Service' : id}
              </span>
            ))}
            <button 
              onClick={scrollToContact} 
              className="bg-primary text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-blue-200"
            >
              お問い合わせ
            </button>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="blob top-20 -left-40"></div>
        <div className="blob bottom-40 -right-40" style={{ animationDelay: '-5s' }}></div>

        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div className="page-content active">
            <section className="py-20 md:py-48 text-center relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                <div className="inline-block bg-blue-50 text-primary px-6 py-2 rounded-full text-xs md:text-sm font-bold mb-8 reveal" style={{ transitionDelay: '0.1s' }}>
                  本当になりたい自分に出会えるキッカケを。
                </div>
                <h1 className="text-4xl md:text-8xl font-black leading-tight mb-8 md:mb-12 reveal keep-all" style={{ transitionDelay: '0.2s' }}>
                  自立の先にある<br className="hidden md:block" />
                  <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">豊かな未来</span>を共に。
                </h1>
                <p className="max-w-3xl mx-auto text-gray-500 text-base md:text-2xl leading-relaxed mb-12 md:mb-16 reveal px-4" style={{ transitionDelay: '0.3s' }}>
                  自立した個人を育成し, その力が「利他」に向けられることで、より良い社会が作られると信じています。
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 reveal" style={{ transitionDelay: '0.4s' }}>
                  <button onClick={() => switchPage('business')} className="w-full md:w-auto bg-primary text-white px-10 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-black hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200 hover:-translate-y-2">
                    事業内容を詳しく
                  </button>
                  <button onClick={scrollToContact} className="w-full md:w-auto bg-white border-2 border-gray-100 px-10 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-black hover:bg-gray-50 transition-all">
                    無料で相談する
                  </button>
                </div>
              </div>
            </section>

            <section className="py-16 md:py-20 bg-gray-50/50">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {[
                    { label: 'History', val: '2017', unit: '年設立', desc: '長年の実績に基づいた安定したサポート体制を構築しています。', delay: '0.1s' },
                    { label: 'Support', val: '2,500', unit: '名以上', desc: '多くの方々の自立を支援し、新たなキャリアを共に創ってきました。', delay: '0.2s' },
                    { label: 'Network', val: '190', unit: 'カ国', desc: 'eBay輸出事業を通じて、日本の価値を世界中へ届けています。', delay: '0.3s' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 reveal" style={{ transitionDelay: item.delay }}>
                      <div className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">{item.label}</div>
                      <div className="text-3xl md:text-4xl font-black text-primary">{item.val}<span className="text-base md:text-lg ml-1">{item.unit}</span></div>
                      <p className="mt-4 text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 md:py-32">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-20 reveal">
                  <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm md:text-base">What we do</h2>
                  <h3 className="text-3xl md:text-6xl font-black italic">Three Core Businesses</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                  {[
                    { id: 'service-ebay', title: 'eBay 輸出物販事業', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200', desc: '日本の中古カメラ等を世界へ。高品質な日本の価値をグローバルに展開。', delay: '0.1s' },
                    { id: 'service-remote', title: '在宅ワークコンサル', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200', desc: '未経験から自立へ。一生モノのスキルを身につけるための完全サポート。', delay: '0.2s' },
                    { id: 'service-se', title: 'SE専門 営業代理', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200', desc: '業界20年のコネクションで, エンジニアに最適な環境と報酬を提供。', delay: '0.3s' }
                  ].map((service, i) => (
                    <div key={i} className="group cursor-pointer reveal hover:scale-[1.02] md:hover:scale-105 transition-transform" onClick={() => switchPage('business', service.id)} style={{ transitionDelay: service.delay }}>
                      <div className="img-container mb-6 md:mb-8 aspect-[4/3] shadow-lg">
                        <img src={service.img} className="business-img w-full h-full object-cover" alt={service.title} />
                      </div>
                      <h4 className="text-xl md:text-2xl font-black mb-3 md:mb-4 group-hover:text-primary transition-colors flex items-center gap-2">
                        {service.title}
                        <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      </h4>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PHILOSOPHY PAGE */}
        {currentPage === 'philosophy' && (
          <div className="page-content active">
            <section className="py-20 md:py-32">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                  <div>
                    <h2 className="text-primary font-bold tracking-widest uppercase mb-4 reveal">Philosophy</h2>
                    <h3 className="text-3xl md:text-7xl font-black mb-8 md:mb-12 reveal">私たちの考え方</h3>
                    <div className="space-y-6 md:space-y-10 reveal">
                      <h4 className="text-2xl md:text-3xl font-black text-primary">利他の心で, 個の力を社会へ。</h4>
                      <p className="text-gray-600 text-lg md:text-xl leading-loose">
                        私たちのミッションは、単に「稼ぐスキル」を教えることではありません。自分自身の力で立ち、生き抜く力を身につけた個人が増えること。そしてその力が、誰かのために使われる社会を創ることです。
                      </p>
                    </div>
                  </div>
                  <div className="relative py-8 md:py-12">
                    <div className="absolute inset-0 bg-pattern -z-10 rounded-[3rem] md:rounded-[4rem]"></div>
                    <div className="space-y-6 md:space-y-8">
                      <div className="glass-card p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-l-[8px] md:border-l-[12px] border-primary reveal" style={{ transitionDelay: '0.1s' }}>
                        <span className="text-xs md:text-sm font-bold text-primary block mb-2">VISION</span>
                        <h4 className="font-black text-xl md:text-2xl mb-4 text-gray-800">本当になりたい自分に出会えるキッカケを。</h4>
                        <p className="text-gray-500 text-sm md:text-base">個々の眠れる可能性を掘り起こし、新しいキャリアの形を共に模索します。</p>
                      </div>
                      <div className="glass-card p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-l-[8px] md:border-l-[12px] border-primaryLight reveal" style={{ transitionDelay: '0.2s' }}>
                        <span className="text-xs md:text-sm font-bold text-primaryLight block mb-2">MISSION</span>
                        <h4 className="font-black text-xl md:text-2xl mb-4 text-gray-800">自立し、利他へ向かう社会の創造</h4>
                        <p className="text-gray-500 text-sm md:text-base">この循環が、私たちの目指す社会の姿です。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SERVICE (BUSINESS) PAGE */}
        {currentPage === 'business' && (
          <div className="page-content active">
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-6 text-center mb-16 md:mb-24">
                <h2 className="text-primary font-bold tracking-widest uppercase mb-4 reveal">Our Service</h2>
                <h3 className="text-3xl md:text-7xl font-black reveal">事業内容</h3>
              </div>
              <div className="max-w-7xl mx-auto px-6 space-y-32 md:space-y-48">
                {/* eBay */}
                <div id="service-ebay" className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-32">
                  <div className="order-2 lg:order-1 reveal">
                    <div className="inline-block bg-blue-50 text-primary px-4 py-1 rounded-full text-[10px] md:text-xs font-bold mb-4 md:mb-6 uppercase tracking-widest">Business 01</div>
                    <h4 className="text-2xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">eBay 輸出物販事業</h4>
                    <p className="text-gray-600 text-base md:text-xl leading-loose mb-8 md:mb-10">
                      世界最大級のオークションサイト「eBay」を通じて, 日本の高品質な中古カメラや精密機器を世界190カ国以上のファンへ。日本の「おもてなし」を検品・梱包技術に込め、グローバル市場で確固たる信頼を築いています。
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <div className="p-6 md:p-8 bg-gray-50 rounded-[1.5rem] md:rounded-[2rem] hover:bg-white border border-transparent hover:border-blue-100 transition-all group">
                        <div className="text-primary font-black text-2xl md:text-3xl mb-1 group-hover:scale-110 transition-transform origin-left">190+</div>
                        <div className="text-[10px] md:text-sm text-gray-500 font-bold">配送対象国</div>
                      </div>
                      <div className="p-6 md:p-8 bg-gray-50 rounded-[1.5rem] md:rounded-[2rem] hover:bg-white border border-transparent hover:border-blue-100 transition-all group">
                        <div className="text-primary font-black text-2xl md:text-3xl mb-1 group-hover:scale-110 transition-transform origin-left">Japan</div>
                        <div className="text-[10px] md:text-sm text-gray-500 font-bold">高品質リユース</div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 img-container shadow-2xl reveal">
                    <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200" alt="eBay Business" className="business-img w-full h-full object-cover aspect-[4/3] lg:aspect-square" />
                  </div>
                </div>

                {/* Remote Work */}
                <div id="service-remote" className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-32">
                  <div className="img-container shadow-2xl reveal">
                    <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200" alt="Remote Work" className="business-img w-full h-full object-cover aspect-[4/3] lg:aspect-square" />
                  </div>
                  <div className="reveal">
                    <div className="inline-block bg-blue-50 text-primary px-4 py-1 rounded-full text-[10px] md:text-xs font-bold mb-4 md:mb-6 uppercase tracking-widest">Business 02</div>
                    <div className="flex flex-wrap items-baseline gap-3 md:gap-4 mb-6 md:mb-8">
                      <h4 className="text-2xl md:text-5xl font-black leading-tight">在宅ワーク支援</h4>
                      <span className="bg-highlight text-white text-base md:text-2xl px-3 md:px-4 py-1 rounded-lg md:rounded-xl font-black animate-pulse-red shadow-lg shadow-red-200">
                        完全無料
                      </span>
                    </div>
                    <p className="text-gray-600 text-base md:text-xl leading-loose mb-8 md:mb-10">
                      累計2,500名以上のサポート実績。未経験から物販のプロへ。初期費用なしで、物販の基礎から収益化までマンツーマン指導。場所に縛られない自由なキャリア構築を強力に後押しします。
                    </p>
                    <a href="https://o2plusno.com/product/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 md:gap-4 bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-200 group w-full md:w-auto justify-center">
                      詳しくはこちら
                      <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </a>
                  </div>
                </div>

                {/* SE Agency */}
                <div id="service-se" className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-32">
                  <div className="order-2 lg:order-1 reveal">
                    <div className="inline-block bg-blue-50 text-primary px-4 py-1 rounded-full text-[10px] md:text-xs font-bold mb-4 md:mb-6 uppercase tracking-widest">Business 03</div>
                    <h4 className="text-2xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">SE業界専門 営業代理</h4>
                    <p className="text-gray-600 text-base md:text-xl leading-loose mb-8 md:mb-10">
                      IT業界での20年以上のキャリアを活かし、SEの就職・案件獲得を支援。多重下請け構造から脱却し、1次請け企業との直契約ルートを提案。エンジニアが技術に集中でき、適正な評価と報酬を得られる環境を創ります。
                    </p>
                    <ul className="space-y-4 md:space-y-6">
                      {[
                        '業界20年の太いネットワーク',
                        '高単価・プライム案件の直紹介'
                      ].map((text, i) => (
                        <li key={i} className="flex items-center gap-3 md:gap-4 group reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 text-primary rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                          </div>
                          <span className="font-bold text-gray-700 text-base md:text-lg">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-1 lg:order-2 img-container shadow-2xl reveal">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200" alt="SE Meeting" className="business-img w-full h-full object-cover aspect-[4/3] lg:aspect-square" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ABOUT PAGE */}
        {currentPage === 'about' && (
          <div className="page-content active">
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-primary font-bold tracking-widest uppercase mb-4 reveal">About</h2>
                <h3 className="text-3xl md:text-7xl font-black mb-12 md:mb-20 reveal">会社概要</h3>
                <div className="grid lg:grid-cols-3 gap-10 md:gap-16">
                  <div className="lg:col-span-2 reveal overflow-x-auto">
                    <div className="overflow-hidden glass-card rounded-[2rem] md:rounded-[3rem] min-w-[300px]">
                      <table className="w-full">
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { th: '会社名', td: '合同会社O2plusNO' },
                            { th: '代表者', td: '大野 研吾', highlight: true },
                            { th: '所在地', td: '〒351-0014 埼玉県朝霞市膝折町1-1-53' },
                            { th: '設立', td: '2017年10月11日' },
                            { th: '古物商許可', td: '第431040060720号（埼玉県公安委員会）' }
                          ].map((row, i) => (
                            <tr key={i} className="flex flex-col md:table-row">
                              <th className="py-4 md:py-8 px-6 md:px-10 bg-gray-50/50 text-gray-500 font-bold w-full md:w-1/3 text-left border-r border-gray-100 text-sm md:text-base">{row.th}</th>
                              <td className={`py-4 md:py-8 px-6 md:px-10 text-lg md:text-xl font-black ${row.highlight ? 'text-primary' : ''}`}>{row.td}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="reveal">
                    <div className="p-8 md:p-12 bg-primary text-white rounded-[2rem] md:rounded-[3rem] shadow-2xl">
                      <h4 className="text-xl md:text-2xl font-black mb-4 md:mb-6">Location</h4>
                      <p className="text-blue-100 leading-loose text-base md:text-lg">
                        埼玉県朝霞市を拠点に、全国のパートナーとフルリモートで。場所に縛られない新しい働き方を自ら体現しています。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CONTACT SECTION */}
        <section id="contact-section" className="py-20 md:py-32 bg-white relative border-t border-gray-100">
          <div className="bg-pattern absolute inset-0 -z-10"></div>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 reveal text-sm md:text-base">Contact</h2>
            <p className="text-3xl md:text-6xl font-black mb-12 md:mb-16 reveal">お問い合わせ</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 reveal">
              <a href="mailto:o2plusno20171011@gmail.com" className="group glass-card p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center hover:bg-primary hover:text-white transition-all duration-500">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-primary transition-all">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <span className="text-sm md:text-lg font-black break-all tracking-tight">o2plusno20171011@gmail.com</span>
              </a>
              <a href="tel:05055276238" className="group glass-card p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center hover:bg-primary hover:text-white transition-all duration-500">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-primary transition-all">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <span className="text-2xl md:text-3xl font-black">050-5527-6238</span>
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
              <div className="lg:col-span-2 reveal">
                <div className="text-xl md:text-2xl font-black text-white mb-6 tracking-tighter">O2plusNO</div>
                <p className="text-gray-400 max-w-md leading-loose text-sm md:text-base">
                  本当になりたい自分に出会えるキッカケを。輸出物販、在宅ワーク支援、SE営業代理を通じて、個人の自立と利他の循環をプロデュースします。
                </p>
              </div>
              <div className="text-sm reveal" style={{ transitionDelay: '0.1s' }}>
                <h5 className="font-bold text-gray-500 uppercase tracking-widest mb-4 md:mb-6">Company Info</h5>
                <ul className="space-y-3 md:space-y-4 text-gray-300">
                  <li>合同会社O2plusNO</li>
                  <li>代表：大野 研吾</li>
                  <li>設立：2017年10月11日</li>
                </ul>
              </div>
              <div className="text-sm reveal" style={{ transitionDelay: '0.2s' }}>
                <h5 className="font-bold text-gray-500 uppercase tracking-widest mb-4 md:mb-6">Location</h5>
                <p className="text-gray-300 leading-relaxed">
                  〒351-0014<br />
                  埼玉県朝霞市膝折町1-1-53
                </p>
              </div>
            </div>
            
            {showPrivacy && (
              <div className="mb-12 p-6 md:p-8 bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 text-left reveal visible">
                <h6 className="text-base md:text-lg font-bold mb-4">プライバシーポリシー</h6>
                <div className="text-xs md:text-sm text-gray-400 space-y-4">
                  <p>合同会社O2plusNO（以下、「当社」）は、本ウェブサイト上で提供するサービスにおける、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。</p>
                  <p>1. 個人情報の管理：当社は、お客さまの個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。</p>
                  <p>2. 個人情報の利用目的：お客さまからお預かりした個人情報は、当社からのご連絡や業務のご案内、ご質問に対する回答として, 電子メールや資料のご送送に利用いたします。</p>
                </div>
                <button onClick={() => setShowPrivacy(false)} className="mt-6 text-[10px] md:text-xs text-white underline">閉じる</button>
              </div>
            )}

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase">&copy; 2017-2026 合同会社O2plusNO.</p>
                <button onClick={() => setShowPrivacy(!showPrivacy)} className="text-[10px] md:text-xs text-gray-500 hover:text-white underline transition-colors">Privacy Policy</button>
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-bold text-gray-500 uppercase">
                {(['home', 'philosophy', 'business', 'about'] as PageId[]).map((id) => (
                  <span key={id} onClick={() => switchPage(id)} className="cursor-pointer hover:text-white transition-colors">{id === 'home' ? 'Home' : id === 'business' ? 'Service' : id}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
