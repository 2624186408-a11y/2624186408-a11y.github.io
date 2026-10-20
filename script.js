(function () {
  'use strict';

  /*
   * 集中配置：空字符串或空数组不会在页面上显示。
   * 项目图片请只使用已脱敏的真实素材；医疗项目不得包含患者信息。
   */
  const SITE_CONFIG = {
    avatarUrl: 'assets/profile/cao-ruowen-800.jpg',
    email: '2624186408@qq.com',
    phone: '18434638553',
    wechatQrUrl: 'assets/profile/wechat-qr.jpg',
    resumes: [
      {
        titleZh: '产品经理', titleEn: 'Product Manager',
        descZh: '侧重需求分析、产品策划与用户运营', descEn: 'Requirements, product planning and user operations',
        url: 'assets/resumes/cao-ruowen-product-manager.pdf'
      },
      {
        titleZh: '商务拓展（BD）', titleEn: 'Business Development',
        descZh: '侧重合作方案、资源协调与业务推进', descEn: 'Partnership plans, resource coordination and execution',
        url: 'assets/resumes/cao-ruowen-business-development.pdf'
      },
      {
        titleZh: '用户增长与创作者运营', titleEn: 'Growth & Creator Operations',
        descZh: '侧重用户增长、内容推广与创作者协作', descEn: 'User growth, content promotion and creator collaboration',
        url: 'assets/resumes/cao-ruowen-growth-creator-operations.pdf'
      }
    ],
    projects: {
      jinchuanggu: {
        cases: {
          study: {
            images: [
              { src: 'assets/projects/jinchuanggu/light-space.webp', width: 2200, height: 1650, labelZh: '空间', labelEn: 'Space', altZh: '晋创谷轻自习独立座位与隔板实景', altEn: 'Jinchuanggu Light Study desk and divider setup', captionZh: '空间规划与基础设施配置', captionEn: 'Space planning and facility setup', fit: 'cover', previewRatio: '16 / 10', previewPosition: '50% 72%' },
              { src: 'assets/projects/jinchuanggu/light-seats.webp', width: 2200, height: 1238, labelZh: '座位', labelEn: 'Seats', altZh: '晋创谷轻自习空间全貌与座位布局', altEn: 'Space overview and seating layout at Jinchuanggu Light Study', captionZh: '空间全貌与座位布局', captionEn: 'Space overview and seating layout', fit: 'cover', previewRatio: '16 / 10', previewPosition: '50% 56%' },
              { src: 'assets/projects/jinchuanggu/light-poster.webp', width: 1086, height: 1448, labelZh: '招募物料', labelEn: 'Recruitment', altZh: '晋创谷轻自习早期招募宣传物料', altEn: 'Early recruitment material for Jinchuanggu Light Study', captionZh: '开业阶段的招募宣传物料', captionEn: 'Recruitment material from the opening phase', fit: 'contain' }
            ]
          },
          unicom: {
            images: [
              { src: 'assets/projects/jinchuanggu/unicom-materials.webp', width: 2200, height: 1650, labelZh: '线下物料', labelEn: 'Offline materials', altZh: '晋创谷与校内联通合作的线下宣传物料实拍', altEn: 'Offline materials for the Jinchuanggu campus China Unicom partnership', captionZh: '新生季合作宣传物料', captionEn: 'Freshman-season partnership materials', fit: 'cover', previewRatio: '16 / 10', previewPosition: '50% 60%' },
              { src: 'assets/projects/jinchuanggu/unicom-flow.webp', width: 1055, height: 1491, labelZh: '领取流程', labelEn: 'Redemption flow', altZh: '联通新生权益注册与领票流程图', altEn: 'Registration and ticket redemption flow for freshman benefits', captionZh: '注册、领票与前台兑换流程', captionEn: 'Registration, ticket pickup and front-desk redemption', fit: 'contain' },
              { src: 'assets/projects/jinchuanggu/unicom-community-redacted.webp', width: 1570, height: 1001, labelZh: '用户沉淀', labelEn: 'User retention', altZh: '已脱敏的联通合作社群运营记录', altEn: 'Privacy-redacted community operations record for the China Unicom partnership', captionZh: '社群运营记录（成员信息已脱敏）', captionEn: 'Community operations record (member details redacted)', fit: 'contain' }
            ]
          },
          beads: {
            images: [
              { src: 'assets/projects/jinchuanggu/beads-material.webp', width: 1672, height: 941, labelZh: '宣传物料', labelEn: 'Campaign material', altZh: '晋创谷拼豆创意工坊宣传物料', altEn: 'Campaign material for the Jinchuanggu bead-art workshop', captionZh: '拼豆业务宣传物料', captionEn: 'Bead-art business campaign material', fit: 'contain' }
            ]
          }
        }
      }
    }
  };

  let currentLang = 'zh';
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const langToggle = document.getElementById('langToggle');
  const lightbox = document.getElementById('lightbox');
  const qrDialog = document.getElementById('qrDialog');
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navAnchors = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
  const sectionLinks = new Map(navAnchors.map(function (link) {
    return [link.getAttribute('href').slice(1), link];
  }));
  let scrollQueued = false;
  let roleExplorerController = null;
  let medicalController = null;
  let wenWorkspaceController = null;
  let bdtController = null;
  let honorsController = null;
  let kpopController = null;
  let lastLightboxTrigger = null;
  let lightboxCloseTimer = 0;

  function setMenu(open, returnFocus) {
    const shouldOpen = Boolean(open && mobileQuery.matches);
    navLinks.classList.toggle('open', shouldOpen);
    navToggle.setAttribute('aria-expanded', String(shouldOpen));
    navToggle.setAttribute('aria-label', shouldOpen
      ? (currentLang === 'zh' ? '关闭菜单' : 'Close menu')
      : (currentLang === 'zh' ? '打开菜单' : 'Open menu'));
    navLinks.inert = mobileQuery.matches && !shouldOpen;
    if (!shouldOpen && returnFocus) navToggle.focus();
  }

  function syncMenuMode() {
    if (mobileQuery.matches) {
      setMenu(navLinks.classList.contains('open'));
    } else {
      navLinks.classList.remove('open');
      navLinks.inert = false;
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function updateLanguage() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-zh][data-en]:not([data-honors-rich])').forEach(function (element) {
      element.textContent = element.getAttribute('data-' + currentLang);
    });
    document.querySelectorAll('[data-aria-zh][data-aria-en]').forEach(function (element) {
      element.setAttribute('aria-label', element.getAttribute('data-aria-' + currentLang));
    });
    document.querySelectorAll('[data-alt-zh][data-alt-en]').forEach(function (element) {
      element.alt = element.getAttribute('data-alt-' + currentLang);
    });
    if (kpopController) kpopController.syncLanguage();
    if (medicalController) medicalController.syncLanguage();
    if (wenWorkspaceController) wenWorkspaceController.syncLanguage();
    if (bdtController) bdtController.syncLanguage();
    if (roleExplorerController) roleExplorerController.syncLanguage();
    if (honorsController) honorsController.syncLanguage();
    langToggle.textContent = currentLang === 'zh' ? 'EN' : '中';
    document.title = currentLang === 'zh' ? '曹若雯 Cao Ruowen — WEN.' : 'Cao Ruowen — Product & Operations Portfolio';
    setMenu(navLinks.classList.contains('open'));
  }

  function updateScrollState() {
    const position = window.scrollY + nav.offsetHeight + 36;
    let activeId = '';
    nav.classList.toggle('scrolled', window.scrollY > 20);
    sections.forEach(function (section) {
      if (position >= section.offsetTop) activeId = section.id;
    });
    navAnchors.forEach(function (link) {
      const active = sectionLinks.get(activeId) === link;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  }

  function onScroll() {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateScrollState);
    }
  }

  function configureContact() {
    const avatar = document.querySelector('[data-config-media="avatar"]');
    if (SITE_CONFIG.avatarUrl) {
      const image = document.createElement('img');
      image.src = SITE_CONFIG.avatarUrl;
      image.alt = '曹若雯';
      image.width = 800;
      image.height = 1120;
      image.setAttribute('data-alt-zh', '曹若雯');
      image.setAttribute('data-alt-en', 'Cao Ruowen');
      avatar.appendChild(image);
      avatar.hidden = false;
    }

    const email = document.querySelector('[data-config-contact="email"]');
    if (SITE_CONFIG.email) {
      email.href = 'mailto:' + SITE_CONFIG.email;
      email.querySelector('[data-config-value]').textContent = SITE_CONFIG.email;
      email.hidden = false;
    }

    const phone = document.querySelector('[data-config-contact="phone"]');
    if (SITE_CONFIG.phone) {
      phone.href = 'tel:' + SITE_CONFIG.phone.replace(/\s/g, '');
      phone.querySelector('[data-config-value]').textContent = SITE_CONFIG.phone;
      phone.hidden = false;
    }

    const wechat = document.querySelector('[data-config-contact="wechat"]');
    if (SITE_CONFIG.wechatQrUrl) {
      qrDialog.querySelector('img').src = SITE_CONFIG.wechatQrUrl;
      wechat.hidden = false;
      wechat.addEventListener('click', function () { qrDialog.showModal(); });
    }

    const resumes = Array.isArray(SITE_CONFIG.resumes)
      ? SITE_CONFIG.resumes.filter(function (resume) { return resume && resume.url; })
      : [];
    if (resumes.length) {
      document.querySelector('[data-resume-nav]').hidden = false;
      const panel = document.querySelector('[data-resume-panel]');
      const grid = document.querySelector('[data-resume-grid]');
      resumes.forEach(function (resume, index) {
        const card = document.createElement('a');
        card.className = 'resume-card';
        card.href = resume.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.setAttribute('aria-label', resume.titleZh + ' PDF');
        card.setAttribute('data-aria-zh', '查看' + resume.titleZh + '简历 PDF');
        card.setAttribute('data-aria-en', 'View ' + resume.titleEn + ' résumé PDF');

        const number = document.createElement('span');
        number.className = 'resume-number';
        number.textContent = String(index + 1).padStart(2, '0');
        const title = makeTranslatedElement('h4', resume.titleZh, resume.titleEn);
        const description = makeTranslatedElement('p', resume.descZh, resume.descEn);
        const action = makeTranslatedElement('span', '查看 / 下载 PDF ↗', 'View / download PDF ↗', 'resume-action');
        card.append(number, title, description, action);
        grid.appendChild(card);
      });
      panel.hidden = false;
    }
  }

  function makeTranslatedElement(tag, zh, en, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.setAttribute('data-zh', zh);
    element.setAttribute('data-en', en);
    element.textContent = currentLang === 'zh' ? zh : en;
    return element;
  }

  function setImageDimensions(image, item) {
    if (item.width && item.height) {
      image.width = item.width;
      image.height = item.height;
    }
  }

  function openImageLightbox(src, alt, trigger) {
    if (lightboxCloseTimer) window.clearTimeout(lightboxCloseTimer);
    lightboxCloseTimer = 0;
    lastLightboxTrigger = trigger || document.activeElement;
    const fullImage = lightbox.querySelector('img');
    fullImage.src = src;
    fullImage.alt = alt;
    lightbox.querySelector('p').textContent = alt;
    lightbox.classList.remove('is-closing', 'is-visible');
    if (!lightbox.open) lightbox.showModal();
    window.requestAnimationFrame(function () {
      lightbox.classList.add('is-visible');
    });
  }

  function closeImageLightbox() {
    if (!lightbox.open || lightbox.classList.contains('is-closing')) return;
    lightbox.classList.remove('is-visible');
    lightbox.classList.add('is-closing');
    const finish = function () {
      lightbox.classList.remove('is-closing');
      lightbox.close();
      if (lastLightboxTrigger && document.contains(lastLightboxTrigger)) lastLightboxTrigger.focus({ preventScroll: true });
      lastLightboxTrigger = null;
    };
    if (reduceMotionQuery.matches) finish();
    else lightboxCloseTimer = window.setTimeout(finish, 360);
  }

  function createProjectLead(container, project, images) {
    const workItem = container.closest('.work-item');
    const body = container.closest('.work-body');
    const header = workItem && workItem.querySelector(':scope > .work-header');
    const snapshot = body && body.querySelector(':scope > .project-snapshot');
    if (!workItem || !body || !header || !snapshot) return images;

    const coverIndex = Number.isInteger(project.coverIndex) ? project.coverIndex : -1;
    const coverItem = coverIndex >= 0 && coverIndex < images.length ? images[coverIndex] : null;
    const lead = document.createElement('div');
    lead.className = 'work-lead' + (coverItem ? '' : ' no-cover');
    const copy = document.createElement('div');
    copy.className = 'work-lead-copy';
    copy.append(header, snapshot);

    if (coverItem) {
      const altZh = coverItem.altZh || '项目图片';
      const altEn = coverItem.altEn || 'Project image';
      const cover = document.createElement('button');
      cover.type = 'button';
      cover.className = 'project-cover';
      cover.setAttribute('data-aria-zh', '查看大图：' + altZh);
      cover.setAttribute('data-aria-en', 'View full image: ' + altEn);
      cover.setAttribute('aria-label', currentLang === 'zh' ? '查看大图：' + altZh : 'View full image: ' + altEn);
      const media = document.createElement('span');
      media.className = 'project-cover-media';
      const image = document.createElement('img');
      image.src = coverItem.src;
      image.alt = currentLang === 'zh' ? altZh : altEn;
      image.setAttribute('data-alt-zh', altZh);
      image.setAttribute('data-alt-en', altEn);
      setImageDimensions(image, coverItem);
      media.appendChild(image);
      const caption = document.createElement('span');
      caption.className = 'project-cover-caption';
      caption.appendChild(makeTranslatedElement('span', coverItem.captionZh || altZh, coverItem.captionEn || altEn));
      caption.appendChild(makeTranslatedElement('span', '查看原图 ↗', 'View full image ↗', 'project-cover-arrow'));
      cover.append(media, caption);
      cover.addEventListener('click', function () {
        openImageLightbox(coverItem.src, currentLang === 'zh' ? altZh : altEn, cover);
      });
      lead.append(cover, copy);
    } else {
      lead.appendChild(copy);
    }
    workItem.insertBefore(lead, body);
    return images.filter(function (_item, index) { return index !== coverIndex; });
  }

  function configureProjectAssets() {
    document.querySelectorAll('.project-assets[data-project]').forEach(function (container) {
      const project = SITE_CONFIG.projects[container.dataset.project];
      if (!project) return;
      const images = Array.isArray(project.images) ? project.images.filter(function (item) { return item && item.src; }) : [];
      const galleryImages = createProjectLead(container, project, images);

      if (galleryImages.length) {
        const imageIntro = document.createElement('div');
        imageIntro.className = 'asset-intro';
        imageIntro.appendChild(makeTranslatedElement('h4', '真实项目素材', 'Real project materials'));
        imageIntro.appendChild(makeTranslatedElement('p', '点击图片查看大图', 'Select an image to view it full size'));
        container.appendChild(imageIntro);

        const gallery = document.createElement('div');
        gallery.className = 'asset-gallery';
        galleryImages.forEach(function (item) {
          const link = document.createElement('a');
          link.href = item.src;
          link.className = 'asset-image is-' + (galleryImages.length === 1 ? 'full' : (item.kind || 'standard'));
          if (item.fit === 'cover') link.classList.add('is-cover');
          const media = document.createElement('span');
          media.className = 'asset-media';
          const image = document.createElement('img');
          const altZh = item.altZh || '项目图片';
          const altEn = item.altEn || 'Project image';
          image.src = item.src;
          image.loading = 'lazy';
          image.decoding = 'async';
          setImageDimensions(image, item);
          image.setAttribute('data-alt-zh', altZh);
          image.setAttribute('data-alt-en', altEn);
          image.alt = currentLang === 'zh' ? altZh : altEn;
          media.appendChild(image);
          link.appendChild(media);
          if (item.captionZh || item.captionEn) {
            link.appendChild(makeTranslatedElement(
              'span',
              item.captionZh || altZh,
              item.captionEn || altEn,
              'asset-caption'
            ));
          }
          link.addEventListener('click', function (event) {
            event.preventDefault();
            openImageLightbox(item.src, currentLang === 'zh' ? altZh : altEn, link);
          });
          gallery.appendChild(link);
        });
        container.appendChild(gallery);
      }

      const videos = Array.isArray(project.videos)
        ? project.videos.filter(function (item) { return item && item.src; })
        : [];
      if (videos.length) {
        const intro = document.createElement('div');
        intro.className = 'asset-intro';
        intro.appendChild(makeTranslatedElement('h4', '真实案例演示', 'Real case demos'));
        intro.appendChild(makeTranslatedElement(
          'p',
          '以下为去标识化的三维模型旋转演示，不包含患者姓名、病历号或原始影像。',
          'De-identified 3D model rotations are shown below, without patient names, record numbers or source imaging.'
        ));
        container.appendChild(intro);

        const stage = document.createElement('div');
        stage.className = 'ct-stage';
        const videoGrid = document.createElement('div');
        videoGrid.className = 'case-gallery';
        videos.forEach(function (item) {
          const figure = document.createElement('figure');
          figure.className = 'case-card';
          const video = document.createElement('video');
          video.src = item.src;
          video.poster = item.poster || '';
          video.controls = true;
          video.preload = 'metadata';
          video.playsInline = true;
          video.setAttribute('controlslist', 'nodownload noplaybackrate');
          video.setAttribute('aria-label', currentLang === 'zh' ? item.titleZh : item.titleEn);
          video.setAttribute('data-aria-zh', item.titleZh);
          video.setAttribute('data-aria-en', item.titleEn);
          video.addEventListener('play', function () {
            document.querySelectorAll('.case-card video').forEach(function (other) {
              if (other !== video) other.pause();
            });
          });
          const caption = document.createElement('figcaption');
          caption.appendChild(makeTranslatedElement('strong', item.titleZh, item.titleEn));
          caption.appendChild(makeTranslatedElement('span', '三维模型旋转展示', '3D model rotation'));
          figure.append(video, caption);
          videoGrid.appendChild(figure);
        });
        stage.appendChild(videoGrid);
        container.appendChild(stage);
      }

      if (project.pdfUrl || project.externalUrl) {
        const links = document.createElement('div');
        links.className = 'asset-links';
        if (project.pdfUrl) {
          const pdf = makeTranslatedElement('a', '查看项目 PDF', 'View project PDF', 'btn btn-secondary');
          pdf.href = project.pdfUrl;
          pdf.target = '_blank';
          pdf.rel = 'noopener noreferrer';
          links.appendChild(pdf);
        }
        if (project.externalUrl) {
          const demo = makeTranslatedElement('a', '打开外部体验', 'Open live experience', 'btn btn-secondary');
          demo.href = project.externalUrl;
          demo.target = '_blank';
          demo.rel = 'noopener noreferrer';
          links.appendChild(demo);
        }
        container.appendChild(links);
      }

      container.hidden = !container.children.length;
    });
  }

  function initJinchuanggu() {
    const root = document.querySelector('[data-jinchuanggu]');
    const project = SITE_CONFIG.projects.jinchuanggu;
    if (!root || !project || !project.cases) return null;

    const caseElements = Array.from(root.querySelectorAll('[data-jc-case]'));
    const transitionTimers = new WeakMap();
    let openId = (caseElements.find(function (caseElement) {
      return caseElement.classList.contains('is-open');
    }) || {}).dataset?.jcCase || null;

    function translated(item, key) {
      return item[key + (currentLang === 'zh' ? 'Zh' : 'En')] || '';
    }

    function renderMedia(caseElement) {
      const caseId = caseElement.dataset.jcCase;
      const config = project.cases[caseId] || {};
      const images = Array.isArray(config.images)
        ? config.images.filter(function (item) { return item && item.src; })
        : [];
      const mediaRoot = caseElement.querySelector('[data-jc-media]');
      const thumb = caseElement.querySelector('[data-jc-thumb]');
      if (!mediaRoot) return;

      if (!images.length) {
        caseElement.classList.add('has-no-media');
        mediaRoot.hidden = true;
        if (thumb) thumb.hidden = true;
        return;
      }

      const first = images[0];
      if (thumb) {
        const thumbImage = document.createElement('img');
        thumbImage.src = first.src;
        thumbImage.alt = '';
        thumbImage.width = first.width || 160;
        thumbImage.height = first.height || 100;
        thumbImage.loading = 'lazy';
        thumbImage.decoding = 'async';
        if (first.previewPosition) thumbImage.style.objectPosition = first.previewPosition;
        if (first.fit === 'contain') thumb.classList.add('is-contain');
        thumb.appendChild(thumbImage);
        thumb.hidden = false;
      }

      const viewer = document.createElement('div');
      viewer.className = 'jc-media-viewer';
      const controls = document.createElement('div');
      controls.className = 'jc-media-tabs';
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', currentLang === 'zh' ? '切换项目图片' : 'Switch project image');
      controls.setAttribute('data-aria-zh', '切换项目图片');
      controls.setAttribute('data-aria-en', 'Switch project image');

      const figureButton = document.createElement('button');
      figureButton.type = 'button';
      figureButton.className = 'jc-media-main';
      const image = document.createElement('img');
      image.loading = 'lazy';
      image.decoding = 'async';
      const caption = makeTranslatedElement('span', first.captionZh, first.captionEn, 'jc-media-caption');
      figureButton.append(image, caption);
      viewer.append(controls, figureButton);
      mediaRoot.appendChild(viewer);

      const state = { index: 0, token: 0, timer: 0 };
      function applyImage(index) {
        const item = images[index];
        state.index = index;
        image.src = item.src;
        image.width = item.width || 1600;
        image.height = item.height || 1000;
        image.alt = translated(item, 'alt');
        image.setAttribute('data-alt-zh', item.altZh || '项目图片');
        image.setAttribute('data-alt-en', item.altEn || 'Project image');
        figureButton.style.setProperty('--jc-media-ratio', item.previewRatio || '4 / 3');
        figureButton.style.setProperty('--jc-media-position', item.previewPosition || '50% 50%');
        figureButton.classList.toggle('is-contain', item.fit === 'contain');
        figureButton.setAttribute('aria-label', (currentLang === 'zh' ? '查看大图：' : 'View full image: ') + translated(item, 'alt'));
        figureButton.setAttribute('data-aria-zh', '查看大图：' + (item.altZh || '项目图片'));
        figureButton.setAttribute('data-aria-en', 'View full image: ' + (item.altEn || 'Project image'));
        caption.setAttribute('data-zh', item.captionZh || item.altZh || '项目图片');
        caption.setAttribute('data-en', item.captionEn || item.altEn || 'Project image');
        caption.textContent = translated(item, 'caption') || translated(item, 'alt');
        controls.querySelectorAll('button').forEach(function (button, buttonIndex) {
          const active = buttonIndex === index;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-pressed', String(active));
        });
      }

      function selectImage(index) {
        if (index === state.index || index < 0 || index >= images.length) return;
        state.token += 1;
        const token = state.token;
        if (state.timer) window.clearTimeout(state.timer);
        viewer.classList.add('is-changing');
        state.timer = window.setTimeout(function () {
          if (token !== state.token) return;
          applyImage(index);
          window.requestAnimationFrame(function () {
            if (token === state.token) viewer.classList.remove('is-changing');
          });
        }, reduceMotionQuery.matches ? 0 : 110);
      }

      images.forEach(function (item, index) {
        const button = makeTranslatedElement('button', item.labelZh, item.labelEn);
        button.type = 'button';
        button.setAttribute('aria-pressed', String(index === 0));
        button.addEventListener('click', function () { selectImage(index); });
        controls.appendChild(button);
      });
      if (images.length < 2) controls.hidden = true;
      figureButton.addEventListener('click', function () {
        const item = images[state.index];
        openImageLightbox(item.src, translated(item, 'alt'), figureButton);
      });
      applyImage(0);
    }

    function setPanelState(caseElement, open, animate) {
      const trigger = caseElement.querySelector('.jc-case-trigger');
      const panel = caseElement.querySelector('.jc-case-panel');
      const inner = caseElement.querySelector('.jc-case-panel-inner');
      if (!trigger || !panel || !inner) return;
      const previousTimer = transitionTimers.get(panel);
      if (previousTimer) window.clearTimeout(previousTimer);

      const currentHeight = panel.getBoundingClientRect().height;
      caseElement.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      panel.inert = !open;

      if (!animate || reduceMotionQuery.matches) {
        panel.style.height = open ? 'auto' : '0px';
        return;
      }

      panel.style.height = currentHeight + 'px';
      panel.offsetHeight;
      const targetHeight = open ? inner.offsetHeight : 0;
      window.requestAnimationFrame(function () {
        panel.style.height = targetHeight + 'px';
      });
      const timer = window.setTimeout(function () {
        if (caseElement.classList.contains('is-open')) panel.style.height = 'auto';
        transitionTimers.delete(panel);
      }, 430);
      transitionTimers.set(panel, timer);
    }

    function setOpen(nextId, animate) {
      openId = nextId;
      caseElements.forEach(function (caseElement) {
        setPanelState(caseElement, caseElement.dataset.jcCase === openId, animate);
      });
    }

    caseElements.forEach(function (caseElement) {
      renderMedia(caseElement);
      const trigger = caseElement.querySelector('.jc-case-trigger');
      trigger.addEventListener('click', function () {
        const caseId = caseElement.dataset.jcCase;
        setOpen(openId === caseId ? null : caseId, true);
      });
    });

    setOpen(openId || 'study', false);
    return { syncLanguage: function () {} };
  }

  /*
   * Local menu-to-grid transition, implemented with the Web Animations API.
   * Interaction concept reference: Codrops MenuToGrid (MIT), without copied source.
   */
  function initKpop() {
    const root = document.querySelector('[data-kpop]');
    if (!root) return null;

    const directions = Array.from(root.querySelectorAll('[data-kp-direction]'));
    const transitionTimers = new WeakMap();
    let openId = null;
    let transitionToken = 0;

    function updateToggle(direction, open) {
      const label = direction.querySelector('[data-kp-toggle-label]');
      if (!label) return;
      label.setAttribute('data-zh', open ? '收起' : '展开');
      label.setAttribute('data-en', open ? 'Close' : 'Expand');
      label.textContent = label.getAttribute('data-' + currentLang);
    }

    function clearTransitionClones() {
      root.querySelectorAll('[data-kp-hero-image] img').forEach(function (image) {
        image.style.opacity = '';
      });
      document.querySelectorAll('.kp-transition-clone').forEach(function (clone) {
        clone.remove();
      });
    }

    function animateThumbToPanel(direction, token) {
      if (reduceMotionQuery.matches || token !== transitionToken) return;
      const source = direction.querySelector('.kp-row-thumbs img');
      const target = direction.querySelector('[data-kp-hero-image] img');
      if (!source || !target || !source.complete) return;

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (token !== transitionToken || !direction.classList.contains('is-open')) return;
          const from = source.getBoundingClientRect();
          const to = target.getBoundingClientRect();
          if (!from.width || !from.height || !to.width || !to.height) return;

          const clone = document.createElement('span');
          clone.className = 'kp-transition-clone';
          Object.assign(clone.style, {
            left: from.left + 'px',
            top: from.top + 'px',
            width: from.width + 'px',
            height: from.height + 'px'
          });
          const cloneImage = source.cloneNode(false);
          cloneImage.removeAttribute('loading');
          clone.appendChild(cloneImage);
          document.body.appendChild(clone);
          target.style.opacity = '0';

          const animation = clone.animate([
            { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px', opacity: .94 },
            { left: to.left + 'px', top: to.top + 'px', width: to.width + 'px', height: to.height + 'px', opacity: 1 }
          ], {
            duration: 420,
            easing: 'cubic-bezier(.22,.61,.36,1)',
            fill: 'forwards'
          });
          animation.finished.catch(function () {}).then(function () {
            if (token === transitionToken) target.style.opacity = '';
            clone.remove();
          });
        });
      });
    }

    function pauseVideos(direction) {
      direction.querySelectorAll('video').forEach(function (video) { video.pause(); });
    }

    function setPanelState(direction, open, animate) {
      const toggle = direction.querySelector('.kp-direction-toggle');
      const panel = direction.querySelector('.kp-direction-panel');
      const inner = direction.querySelector('.kp-direction-panel-inner');
      if (!toggle || !panel || !inner) return;

      const previousTimer = transitionTimers.get(panel);
      if (previousTimer) window.clearTimeout(previousTimer);
      const currentHeight = panel.getBoundingClientRect().height;

      direction.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      panel.inert = !open;
      updateToggle(direction, open);
      if (!open) pauseVideos(direction);

      if (!animate || reduceMotionQuery.matches) {
        panel.style.height = open ? 'auto' : '0px';
        return;
      }

      panel.style.height = currentHeight + 'px';
      panel.offsetHeight;
      const targetHeight = open ? inner.offsetHeight : 0;
      window.requestAnimationFrame(function () {
        panel.style.height = targetHeight + 'px';
      });
      const timer = window.setTimeout(function () {
        if (direction.classList.contains('is-open')) panel.style.height = 'auto';
        transitionTimers.delete(panel);
      }, 450);
      transitionTimers.set(panel, timer);
    }

    function setOpen(nextId, animate) {
      transitionToken += 1;
      const token = transitionToken;
      clearTransitionClones();
      openId = nextId;
      directions.forEach(function (direction) {
        setPanelState(direction, direction.dataset.kpDirection === openId, animate);
      });
      const nextDirection = directions.find(function (direction) {
        return direction.dataset.kpDirection === openId;
      });
      if (nextDirection && animate) animateThumbToPanel(nextDirection, token);
    }

    directions.forEach(function (direction) {
      const toggle = direction.querySelector('.kp-direction-toggle');
      toggle.addEventListener('click', function () {
        const id = direction.dataset.kpDirection;
        setOpen(openId === id ? null : id, true);
      });
    });

    window.addEventListener('resize', function () {
      directions.forEach(function (direction) {
        const panel = direction.querySelector('.kp-direction-panel');
        panel.style.height = direction.classList.contains('is-open') ? 'auto' : '0px';
      });
    }, { passive: true });

    setOpen(null, false);
    return {
      syncLanguage: function () {
        directions.forEach(function (direction) {
          updateToggle(direction, direction.classList.contains('is-open'));
        });
      }
    };
  }

  function initWenWorkspace() {
    const root = document.querySelector('[data-wen-workspace]');
    if (!root) return null;
    const choices = Array.from(root.querySelectorAll('[data-wen-choice]'));
    const stage = root.querySelector('[data-wen-media-stage]');
    const mediaButton = stage && stage.querySelector('.wen-compact-media-button');
    const image = mediaButton && mediaButton.querySelector('img');
    const title = stage && stage.querySelector('[data-wen-media-title]');
    const caption = stage && stage.querySelector('[data-wen-media-caption]');
    let activeChoice = choices[0] ? choices[0].dataset.wenChoice : '';
    let switchTimer = 0;
    let switchToken = 0;

    function localizedData(node, key) {
      return node.dataset[key + (currentLang === 'zh' ? 'Zh' : 'En')];
    }

    function pauseMedia() {
      root.querySelectorAll('video').forEach(function (video) { video.pause(); });
    }

    function applyChoice(choice) {
      if (!choice || !image || !mediaButton) return;
      activeChoice = choice.dataset.wenChoice;
      choices.forEach(function (button) {
        const selected = button === choice;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      stage.setAttribute('aria-labelledby', choice.id);
      const alt = localizedData(choice, 'alt');
      const mediaTitle = localizedData(choice, 'title');
      const mediaCaption = localizedData(choice, 'caption');
      image.src = choice.dataset.src;
      image.width = Number(choice.dataset.width) || image.width;
      image.height = Number(choice.dataset.height) || image.height;
      image.alt = alt;
      image.setAttribute('data-alt-zh', choice.dataset.altZh);
      image.setAttribute('data-alt-en', choice.dataset.altEn);
      mediaButton.dataset.wenZoom = choice.dataset.src;
      mediaButton.setAttribute('aria-label', (currentLang === 'zh' ? '查看大图：' : 'View full image: ') + alt);
      title.textContent = mediaTitle;
      title.setAttribute('data-zh', choice.dataset.titleZh);
      title.setAttribute('data-en', choice.dataset.titleEn);
      caption.textContent = mediaCaption;
      caption.setAttribute('data-zh', choice.dataset.captionZh);
      caption.setAttribute('data-en', choice.dataset.captionEn);
    }

    function setChoice(id, focusChoice) {
      const choice = choices.find(function (button) { return button.dataset.wenChoice === id; });
      if (!choice) return;
      if (id === activeChoice) {
        if (focusChoice) choice.focus();
        return;
      }
      pauseMedia();
      if (switchTimer) window.clearTimeout(switchTimer);
      const token = ++switchToken;
      const finish = function () {
        if (token !== switchToken) return;
        applyChoice(choice);
        window.requestAnimationFrame(function () { stage.classList.remove('is-switching'); });
        if (focusChoice) choice.focus();
        switchTimer = 0;
      };
      if (reduceMotionQuery.matches) finish();
      else {
        stage.classList.add('is-switching');
        switchTimer = window.setTimeout(finish, 115);
      }
    }

    choices.forEach(function (choice, index) {
      choice.addEventListener('click', function () { setChoice(choice.dataset.wenChoice, false); });
      choice.addEventListener('keydown', function (event) {
        let nextIndex = -1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % choices.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + choices.length) % choices.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = choices.length - 1;
        if (nextIndex < 0) return;
        event.preventDefault();
        setChoice(choices[nextIndex].dataset.wenChoice, true);
      });
    });

    root.addEventListener('click', function (event) {
      const zoom = event.target.closest('[data-wen-zoom]');
      if (!zoom || !root.contains(zoom)) return;
      const image = zoom.querySelector('img');
      openImageLightbox(zoom.dataset.wenZoom, image ? image.alt : 'Wen Workspace', zoom);
    });

    applyChoice(choices.find(function (choice) { return choice.dataset.wenChoice === activeChoice; }));
    return {
      syncLanguage: function () {
        applyChoice(choices.find(function (choice) { return choice.dataset.wenChoice === activeChoice; }));
      }
    };
  }

  function initMedicalCase() {
    const root = document.querySelector('[data-medical-case]');
    if (!root) return null;

    const tabs = Array.from(root.querySelectorAll('[data-medical-stage]'));
    const panels = Array.from(root.querySelectorAll('[data-medical-panel]'));
    const viewport = root.querySelector('[data-medical-viewport]');
    const videos = Array.from(root.querySelectorAll('video'));
    const note = root.querySelector('.medical-work-note');
    const noteAction = note && note.querySelector('summary b');
    let activeId = 'model';
    let swapTimer = 0;

    function pauseVideos() {
      videos.forEach(function (video) { video.pause(); });
    }

    function applyStage(id) {
      activeId = id;
      tabs.forEach(function (tab) {
        const selected = tab.dataset.medicalStage === id;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(function (panel) {
        const selected = panel.dataset.medicalPanel === id;
        panel.hidden = !selected;
        panel.classList.toggle('is-active', selected);
      });
    }

    function setStage(id, focusTab) {
      const nextTab = tabs.find(function (tab) { return tab.dataset.medicalStage === id; });
      if (!nextTab || id === activeId) {
        if (focusTab && nextTab) nextTab.focus();
        return;
      }
      if (swapTimer) window.clearTimeout(swapTimer);
      pauseVideos();

      const finish = function () {
        applyStage(id);
        window.requestAnimationFrame(function () { viewport.classList.remove('is-switching'); });
        if (focusTab) nextTab.focus();
        swapTimer = 0;
      };

      if (reduceMotionQuery.matches) {
        finish();
      } else {
        viewport.classList.add('is-switching');
        swapTimer = window.setTimeout(finish, 130);
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { setStage(tab.dataset.medicalStage, false); });
      tab.addEventListener('keydown', function (event) {
        let nextIndex = -1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex < 0) return;
        event.preventDefault();
        setStage(tabs[nextIndex].dataset.medicalStage, true);
      });
    });

    root.querySelectorAll('[data-medical-zoom]').forEach(function (button) {
      button.addEventListener('click', function () {
        const image = button.querySelector('img');
        const alt = image ? image.alt : (currentLang === 'zh' ? '项目图片' : 'Project image');
        openImageLightbox(button.dataset.medicalZoom, alt, button);
      });
    });

    function syncNoteAction() {
      if (!noteAction) return;
      noteAction.textContent = note.open
        ? (currentLang === 'zh' ? '收起' : 'Close')
        : (currentLang === 'zh' ? '查看详情' : 'View details');
    }
    if (note) note.addEventListener('toggle', syncNoteAction);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pauseVideos();
    });

    applyStage(activeId);
    syncNoteAction();
    return {
      syncLanguage: function () { syncNoteAction(); }
    };
  }

  function initBdt() {
    const root = document.querySelector('[data-bdt]');
    if (!root) return null;

    const explorer = root.querySelector('[data-bdt-apparel-explorer]');
    const detail = root.querySelector('[data-bdt-apparel-detail]');
    const groupButtons = Array.from(root.querySelectorAll('[data-bdt-group]'));
    const groupSwitches = Array.from(root.querySelectorAll('[data-bdt-detail-group]'));
    const styleOptions = Array.from(root.querySelectorAll('[data-bdt-style]'));
    const closeButton = root.querySelector('[data-bdt-apparel-close]');
    const groupKicker = root.querySelector('[data-bdt-group-kicker]');
    const groupTitle = root.querySelector('[data-bdt-group-title]');
    const wornZoom = root.querySelector('[data-bdt-worn-zoom]');
    const wornImage = root.querySelector('[data-bdt-worn-image]');
    const wornCaption = root.querySelector('[data-bdt-worn-caption]');
    const specZoom = root.querySelector('[data-bdt-spec-zoom]');
    const specImage = root.querySelector('[data-bdt-spec-image]');
    const styleTitle = root.querySelector('[data-bdt-style-title]');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const activeStyles = { short: 'black', long: 'red' };
    let activeGroup = '';
    let pinnedGroup = '';
    let lastTrigger = null;
    let hoverTimer = 0;
    let closeTimer = 0;
    let switchTimer = 0;
    let switchToken = 0;

    function clearHoverTimer() {
      if (hoverTimer) window.clearTimeout(hoverTimer);
      hoverTimer = 0;
    }

    function clearCloseTimer() {
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = 0;
    }

    function localized(element, name) {
      return element ? (element.getAttribute('data-' + name + '-' + currentLang) || '') : '';
    }

    function updateMedia(option) {
      if (!option || !wornImage || !specImage || !wornZoom || !specZoom || !styleTitle) return;
      const titleZh = option.dataset.titleZh;
      const titleEn = option.dataset.titleEn;
      const title = currentLang === 'zh' ? titleZh : titleEn;
      const specAlt = currentLang === 'zh' ? option.dataset.specAltZh : option.dataset.specAltEn;
      const wornAlt = currentLang === 'zh' ? option.dataset.wornAltZh : option.dataset.wornAltEn;

      specImage.src = option.dataset.specSrc;
      specImage.width = Number(option.dataset.specWidth);
      specImage.height = Number(option.dataset.specHeight);
      specImage.alt = specAlt;
      specImage.dataset.altZh = option.dataset.specAltZh;
      specImage.dataset.altEn = option.dataset.specAltEn;
      specZoom.dataset.bdtZoom = option.dataset.specSrc;
      specZoom.dataset.ariaZh = '查看' + titleZh + '完整规格图';
      specZoom.dataset.ariaEn = 'View the full ' + titleEn.toLowerCase() + ' specification';
      specZoom.setAttribute('aria-label', localized(specZoom, 'aria'));

      wornImage.src = option.dataset.wornSrc;
      wornImage.width = Number(option.dataset.wornWidth);
      wornImage.height = Number(option.dataset.wornHeight);
      wornImage.alt = wornAlt;
      wornImage.dataset.altZh = option.dataset.wornAltZh;
      wornImage.dataset.altEn = option.dataset.wornAltEn;
      wornImage.style.setProperty('--bdt-worn-position', option.dataset.wornPosition || '50% 58%');
      wornImage.style.setProperty('--bdt-worn-position-mobile', option.dataset.wornPositionMobile || option.dataset.wornPosition || '50% 58%');
      wornZoom.dataset.bdtZoom = option.dataset.wornSrc;
      wornZoom.dataset.ariaZh = '查看' + titleZh + '真实上身照片';
      wornZoom.dataset.ariaEn = 'View the ' + titleEn.toLowerCase() + ' in use';
      wornZoom.setAttribute('aria-label', localized(wornZoom, 'aria'));

      styleTitle.textContent = title;
      styleTitle.dataset.zh = titleZh;
      styleTitle.dataset.en = titleEn;
      wornCaption.textContent = activeGroup === 'long'
        ? (currentLang === 'zh' ? '真实上身 · 三色同组对照' : 'Real wear · Three-color comparison')
        : (currentLang === 'zh' ? '真实上身 · ' + titleZh : 'Real wear · ' + titleEn);

      const groupButton = groupButtons.find(function (button) { return button.dataset.bdtGroup === activeGroup; });
      const groupNameNode = groupButton && groupButton.querySelector('strong');
      const groupName = groupNameNode ? (groupNameNode.getAttribute('data-' + currentLang) || groupNameNode.textContent) : '';
      if (groupTitle) groupTitle.textContent = (groupName || (activeGroup === 'long' ? '长袖组' : '短袖组')) + '｜' + title;

      styleOptions.forEach(function (item) {
        const belongs = item.dataset.group === activeGroup;
        item.hidden = !belongs;
        item.setAttribute('aria-selected', String(belongs && item === option));
        item.tabIndex = belongs && item === option ? 0 : -1;
      });
    }

    function setStyle(styleId, immediate) {
      const option = styleOptions.find(function (item) {
        return item.dataset.group === activeGroup && item.dataset.bdtStyle === styleId;
      });
      if (!option) return;
      clearHoverTimer();
      switchToken += 1;
      const token = switchToken;
      if (switchTimer) window.clearTimeout(switchTimer);
      activeStyles[activeGroup] = styleId;
      if (immediate || reduceMotionQuery.matches) {
        detail.classList.remove('is-switching');
        updateMedia(option);
        return;
      }
      detail.classList.add('is-switching');
      switchTimer = window.setTimeout(function () {
        if (token !== switchToken) return;
        updateMedia(option);
        window.requestAnimationFrame(function () {
          if (token === switchToken) detail.classList.remove('is-switching');
        });
        switchTimer = 0;
      }, 90);
    }

    function showGroup(groupId, pin, trigger, immediate) {
      const groupButton = groupButtons.find(function (button) { return button.dataset.bdtGroup === groupId; });
      if (!explorer || !detail || !groupButton) return;
      clearHoverTimer();
      clearCloseTimer();
      activeGroup = groupId;
      if (pin) pinnedGroup = groupId;
      if (trigger) lastTrigger = trigger;
      explorer.classList.toggle('is-from-long', groupId === 'long');
      explorer.classList.toggle('is-pinned', Boolean(pin));
      explorer.classList.add('is-open');
      if (pin) detail.removeAttribute('inert');
      else detail.setAttribute('inert', '');
      detail.setAttribute('aria-hidden', 'false');
      if (groupKicker) groupKicker.textContent = groupId === 'long' ? 'LONG SLEEVE' : 'SHORT SLEEVE';
      groupButtons.forEach(function (button) {
        button.setAttribute('aria-expanded', String(button.dataset.bdtGroup === groupId));
      });
      groupSwitches.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.bdtDetailGroup === groupId));
      });
      styleOptions.forEach(function (option) { option.hidden = option.dataset.group !== groupId; });
      const preferred = activeStyles[groupId] || groupButton.dataset.defaultStyle;
      setStyle(preferred, immediate);
    }

    function closeDetail(restoreFocus) {
      if (!explorer || !detail || !activeGroup) return;
      clearHoverTimer();
      clearCloseTimer();
      pinnedGroup = '';
      activeGroup = '';
      explorer.classList.remove('is-open', 'is-from-long', 'is-pinned');
      detail.setAttribute('aria-hidden', 'true');
      detail.setAttribute('inert', '');
      detail.classList.remove('is-switching');
      groupButtons.forEach(function (button) { button.setAttribute('aria-expanded', 'false'); });
      if (restoreFocus && lastTrigger) lastTrigger.focus();
    }

    groupButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        pinnedGroup = button.dataset.bdtGroup;
        showGroup(button.dataset.bdtGroup, true, button, false);
      });
      button.addEventListener('mouseenter', function () {
        if (!finePointerQuery.matches || pinnedGroup) return;
        clearHoverTimer();
        hoverTimer = window.setTimeout(function () {
          showGroup(button.dataset.bdtGroup, false, button, false);
        }, 140);
      });
      button.addEventListener('mouseleave', clearHoverTimer);
    });

    if (explorer) {
      explorer.addEventListener('mouseenter', clearCloseTimer);
      explorer.addEventListener('mouseleave', function () {
        clearHoverTimer();
        if (!finePointerQuery.matches || pinnedGroup || !activeGroup) return;
        closeTimer = window.setTimeout(function () { closeDetail(false); }, 160);
      });
    }

    groupSwitches.forEach(function (button) {
      button.addEventListener('click', function () {
        pinnedGroup = button.dataset.bdtDetailGroup;
        showGroup(button.dataset.bdtDetailGroup, true, lastTrigger, false);
      });
    });

    styleOptions.forEach(function (option) {
      option.addEventListener('click', function () { setStyle(option.dataset.bdtStyle, false); });
    });

    if (closeButton) closeButton.addEventListener('click', function () { closeDetail(true); });
    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !activeGroup) return;
      event.preventDefault();
      closeDetail(true);
    });

    root.addEventListener('click', function (event) {
      const zoom = event.target.closest('[data-bdt-zoom]');
      if (!zoom || !root.contains(zoom)) return;
      const image = zoom.querySelector('img');
      const alt = image ? image.alt : (currentLang === 'zh' ? '舞社项目图片' : 'B.D.T project image');
      openImageLightbox(zoom.dataset.bdtZoom, alt, zoom);
    });

    return {
      syncLanguage: function () {
        if (!activeGroup) return;
        setStyle(activeStyles[activeGroup], true);
      }
    };
  }

  function initRoleExplorer() {
    const root = document.querySelector('[data-role-explorer]');
    if (!root) return null;

    const cards = Array.from(root.querySelectorAll('.role-card[data-role-id]'));
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    let activeId = null;
    let pinnedId = null;
    let hoverTimer = 0;
    let hoverCandidate = null;
    let heightFrame = 0;
    let resizeFrame = 0;

    function clearHoverTimer() {
      if (hoverTimer) window.clearTimeout(hoverTimer);
      hoverTimer = 0;
      hoverCandidate = null;
    }

    function setExpanded(id, animate) {
      if (id && !cards.some(function (card) { return card.dataset.roleId === id; })) return;
      clearHoverTimer();
      if (heightFrame) window.cancelAnimationFrame(heightFrame);

      const startHeights = new Map();
      cards.forEach(function (card) {
        startHeights.set(card, card.querySelector('.role-card-details').getBoundingClientRect().height);
      });

      activeId = id;
      cards.forEach(function (card) {
        const expanded = card.dataset.roleId === activeId;
        const pinned = card.dataset.roleId === pinnedId;
        const trigger = card.querySelector('.role-card-trigger');
        const panel = card.querySelector('.role-card-details');
        const fixed = card.querySelector('.role-card-fixed');
        panel.style.height = startHeights.get(card) + 'px';
        card.classList.toggle('is-expanded', expanded);
        card.classList.toggle('is-pinned', pinned);
        trigger.setAttribute('aria-expanded', String(expanded));
        trigger.setAttribute('aria-pressed', String(pinned));
        panel.setAttribute('aria-hidden', String(!expanded));
        panel.inert = !expanded;
        panel.querySelectorAll('a').forEach(function (link) { link.tabIndex = expanded ? 0 : -1; });
        fixed.setAttribute('aria-hidden', String(!pinned));
      });

      const finishHeights = function () {
        cards.forEach(function (card) {
          const panel = card.querySelector('.role-card-details');
          panel.style.height = card.dataset.roleId === activeId ? panel.scrollHeight + 'px' : '0px';
        });
      };

      if (!animate || reduceMotionQuery.matches) {
        finishHeights();
      } else {
        root.offsetHeight;
        heightFrame = window.requestAnimationFrame(finishHeights);
      }
    }

    root.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse' || !finePointerQuery.matches || pinnedId) return;
      const card = event.target.closest('.role-card[data-role-id]');
      if (!card || !root.contains(card)) {
        clearHoverTimer();
        return;
      }
      const id = card.dataset.roleId;
      if (id === activeId) {
        clearHoverTimer();
        return;
      }
      if (hoverCandidate === id) return;
      clearHoverTimer();
      hoverCandidate = id;
      hoverTimer = window.setTimeout(function () {
        if (!pinnedId && hoverCandidate === id) setExpanded(id, true);
      }, 180);
    });

    root.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse') return;
      clearHoverTimer();
      if (!pinnedId) setExpanded(null, true);
    });

    cards.forEach(function (card) {
      const id = card.dataset.roleId;
      const trigger = card.querySelector('.role-card-trigger');
      trigger.addEventListener('focus', function () {
        if (!pinnedId) setExpanded(id, true);
      });
      trigger.addEventListener('click', function () {
        if (pinnedId === id) {
          pinnedId = null;
          setExpanded(finePointerQuery.matches ? id : null, true);
          return;
        }
        pinnedId = id;
        setExpanded(id, true);
      });
    });

    root.addEventListener('focusout', function () {
      window.setTimeout(function () {
        if (!pinnedId && !root.contains(document.activeElement)) setExpanded(null, true);
      }, 0);
    });

    document.addEventListener('pointerdown', function (event) {
      if (!root.contains(event.target) && (pinnedId || activeId)) {
        pinnedId = null;
        setExpanded(null, true);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || (!pinnedId && !activeId)) return;
      pinnedId = null;
      setExpanded(null, true);
    });

    function resetForInputMode() {
      pinnedId = null;
      setExpanded(null, false);
    }
    if (typeof finePointerQuery.addEventListener === 'function') {
      finePointerQuery.addEventListener('change', resetForInputMode);
    }

    window.addEventListener('resize', function () {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(function () { setExpanded(activeId, false); });
    }, { passive: true });

    setExpanded(null, false);
    return {
      syncLanguage: function () {
        window.requestAnimationFrame(function () { setExpanded(activeId, false); });
      }
    };
  }

  function initHonors() {
    const root = document.querySelector('[data-honors-module]');
    const data = Array.isArray(window.HONORS_DATA) ? window.HONORS_DATA : [];
    if (!root || !data.length) return null;

    const stage = root.querySelector('[data-honors-stage]');
    const base = root.querySelector('[data-honors-base]');
    const list = root.querySelector('[data-honors-list]');
    const curtain = root.querySelector('[data-honors-curtain]');
    const toggle = root.querySelector('[data-honors-toggle]');
    const heading = root.querySelector('.honors-heading');
    const toggleText = root.querySelector('[data-honors-toggle-text]');
    const closeCurtainButton = root.querySelector('[data-honors-close]');
    const viewer = document.getElementById('honorViewer');
    const viewerImage = viewer.querySelector('[data-honor-viewer-image]');
    const viewerTitle = viewer.querySelector('#honorViewerTitle');
    const viewerCount = viewer.querySelector('[data-honor-viewer-count]');
    const viewerPrev = viewer.querySelector('[data-honor-prev]');
    const viewerNext = viewer.querySelector('[data-honor-next]');
    const viewerClose = viewer.querySelector('[data-honor-viewer-close]');
    const viewerZoomIn = viewer.querySelector('[data-honor-zoom-in]');
    const viewerZoomOut = viewer.querySelector('[data-honor-zoom-out]');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const categoryMeta = {
      research: {
        index: '01',
        titleZh: '研究与解决问题', titleEn: 'Research & problem solving',
        descriptionZh: '科研竞赛、创新大赛、三维数字化设计与大创项目。',
        descriptionEn: 'Research competitions, innovation challenges, 3D digital design and student innovation projects.'
      },
      organization: {
        index: '02',
        titleZh: '组织与推动落地', titleEn: 'Organization & delivery',
        descriptionZh: '志愿服务项目、实践团队、社团与团学相关荣誉。',
        descriptionEn: 'Volunteer-service projects, practice teams, clubs and student-organization recognition.'
      },
      expression: {
        index: '03',
        titleZh: '表达与建立连接', titleEn: 'Expression & connection',
        descriptionZh: '内容表达、舞台活动与志愿服务。',
        descriptionEn: 'Content expression, stage activities and volunteer service.'
      }
    };
    const categories = ['research', 'organization', 'expression'];
    const expandedCategories = new Set();
    let state = 'closed';
    let previewTimer = 0;
    let previewToken = 0;
    let preview = null;
    let viewerOpen = false;
    let viewerItem = null;
    let viewerEvidenceIndex = 0;
    let viewerZoom = 1;
    let viewerTrigger = null;

    function localeValue(item, key) {
      return item[key + (currentLang === 'zh' ? 'Zh' : 'En')] || '';
    }

    function label(zh, en) {
      return currentLang === 'zh' ? zh : en;
    }

    function ensurePreview() {
      if (preview) return preview;
      preview = document.createElement('div');
      preview.className = 'honor-preview';
      preview.setAttribute('aria-hidden', 'true');
      preview.innerHTML = '<span class="honor-preview-media"><img alt=""></span>';
      document.body.appendChild(preview);
      return preview;
    }

    function positionPreview(point, trigger) {
      const element = ensurePreview();
      const rect = trigger.getBoundingClientRect();
      const x = point ? point.clientX : rect.right;
      const y = point ? point.clientY : rect.top + rect.height / 2;
      const previewRect = element.getBoundingClientRect();
      const width = previewRect.width || 300;
      const height = previewRect.height || 240;
      let left = x + 18;
      if (left + width > window.innerWidth - 14) left = x - width - 18;
      left = Math.max(14, Math.min(left, window.innerWidth - width - 14));
      const top = Math.max(14, Math.min(y - height / 2, window.innerHeight - height - 14));
      element.style.left = left + 'px';
      element.style.top = top + 'px';
    }

    function hidePreview() {
      if (previewTimer) window.clearTimeout(previewTimer);
      previewTimer = 0;
      previewToken += 1;
      if (preview) preview.classList.remove('is-visible');
    }

    function schedulePreview(item, trigger, point, delay) {
      if (!finePointerQuery.matches || state !== 'closed' || viewerOpen || !item.evidence || !item.evidence.length) return;
      hidePreview();
      const token = ++previewToken;
      previewTimer = window.setTimeout(function () {
        if (state !== 'closed' || viewerOpen || token !== previewToken) return;
        const element = ensurePreview();
        const evidence = item.evidence[0];
        const image = element.querySelector('img');
        image.alt = localeValue(evidence, 'alt');
        element.className = 'honor-preview';
        function reveal() {
          if (token !== previewToken || state !== 'closed' || viewerOpen) return;
          positionPreview(point, trigger);
          element.classList.add('is-visible');
          window.requestAnimationFrame(function () { positionPreview(point, trigger); });
        }
        image.onload = reveal;
        image.src = evidence.src;
        if (image.complete && image.naturalWidth) reveal();
      }, delay == null ? 140 : delay);
    }

    function updateRichCopy() {
      root.querySelectorAll('[data-honors-rich]').forEach(function (element) {
        element.innerHTML = element.getAttribute('data-' + currentLang);
      });
    }

    function setCurtainHeight() {
      const compactHeight = list.getBoundingClientRect().height;
      const minimum = mobileQuery.matches ? 600 : 520;
      const ceiling = mobileQuery.matches ? 760 : 680;
      const height = Math.max(minimum, Math.min(Math.ceil(compactHeight + 42), ceiling));
      stage.style.setProperty('--honors-curtain-height', height + 'px');
    }

    function renderState() {
      const open = state !== 'closed';
      root.dataset.honorsState = state;
      toggle.setAttribute('aria-expanded', String(open));
      const idleText = finePointerQuery.matches
        ? label('悬停了解 · 移开收起', 'Hover to explore · leave to close')
        : label('点击展开', 'Tap to open');
      toggleText.textContent = finePointerQuery.matches
        ? idleText
        : (open ? label('收起', 'Close') : idleText);
      curtain.setAttribute('aria-hidden', String(!open));
      base.classList.toggle('is-inert', open);
      base.inert = open;
      if (open) hidePreview();
    }

    function setState(nextState) {
      state = nextState;
      renderState();
    }

    function formatMetadata(item) {
      const values = [localeValue(item, 'identity'), localeValue(item, 'level')].filter(Boolean);
      if (!values.length) return null;
      const meta = document.createElement('span');
      meta.className = 'honor-item-meta';
      values.forEach(function (value) {
        const part = document.createElement('span');
        part.textContent = value;
        meta.appendChild(part);
      });
      return meta;
    }

    function makeHonorItem(item, isExtra) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'honor-item' + (isExtra ? ' is-extra' : '');
      if (isExtra && !expandedCategories.has(item.category)) button.hidden = true;
      button.dataset.honorId = item.id;
      const main = document.createElement('span');
      main.className = 'honor-item-main';
      const title = document.createElement('span');
      title.className = 'honor-item-title';
      title.textContent = localeValue(item, 'title');
      const award = document.createElement('span');
      award.className = 'honor-item-award';
      award.textContent = [localeValue(item, 'award'), item.year].filter(Boolean).join(' · ');
      title.appendChild(award);
      main.appendChild(title);
      const metadata = formatMetadata(item);
      if (metadata) main.appendChild(metadata);
      const proof = document.createElement('span');
      proof.className = 'honor-item-proof';
      proof.textContent = label('查看证明 ↗', 'View evidence ↗');
      button.append(main, proof);
      button.addEventListener('pointerenter', function (event) {
        if (event.pointerType === 'mouse') schedulePreview(item, button, event, 145);
      });
      button.addEventListener('pointermove', function (event) {
        if (preview && preview.classList.contains('is-visible')) positionPreview(event, button);
      });
      button.addEventListener('pointerleave', hidePreview);
      button.addEventListener('focus', function () { schedulePreview(item, button, null, 70); });
      button.addEventListener('blur', hidePreview);
      button.addEventListener('click', function () { openViewer(item, button); });
      return button;
    }

    function renderList() {
      list.replaceChildren();
      categories.forEach(function (category) {
        const meta = categoryMeta[category];
        const group = document.createElement('section');
        group.className = 'honor-group';
        group.dataset.honorCategory = category;
        const heading = document.createElement('div');
        heading.className = 'honor-group-label';
        const index = document.createElement('span');
        index.className = 'honor-group-index';
        index.textContent = meta.index;
        const title = document.createElement('h3');
        title.textContent = label(meta.titleZh, meta.titleEn);
        const description = document.createElement('p');
        description.textContent = label(meta.descriptionZh, meta.descriptionEn);
        heading.append(index, title, description);
        const records = data.filter(function (item) { return item.category === category; });
        const selected = records.filter(function (item) { return item.featured; }).slice(0, 5);
        const remainder = records.filter(function (item) { return selected.indexOf(item) === -1; });
        const items = document.createElement('div');
        items.className = 'honor-list';
        selected.forEach(function (item) { items.appendChild(makeHonorItem(item, false)); });
        remainder.forEach(function (item) { items.appendChild(makeHonorItem(item, true)); });
        if (remainder.length) {
          const more = document.createElement('button');
          more.type = 'button';
          more.className = 'honors-more';
          more.setAttribute('aria-expanded', String(expandedCategories.has(category)));
          more.textContent = expandedCategories.has(category)
            ? label('收起其余材料 ↑', 'Hide additional records ↑')
            : label('查看其余 ' + remainder.length + ' 项 ↓', 'View ' + remainder.length + ' more ↓');
          more.addEventListener('click', function () {
            if (expandedCategories.has(category)) expandedCategories.delete(category);
            else expandedCategories.add(category);
            renderList();
            window.requestAnimationFrame(setCurtainHeight);
          });
          items.appendChild(more);
        }
        group.append(heading, items);
        list.appendChild(group);
      });
      window.requestAnimationFrame(setCurtainHeight);
    }

    function renderViewer() {
      if (!viewerItem) return;
      const evidence = viewerItem.evidence[viewerEvidenceIndex];
      viewerImage.src = evidence.src;
      viewerImage.alt = localeValue(evidence, 'alt');
      viewerImage.style.setProperty('--honor-zoom', viewerZoom);
      viewerTitle.textContent = localeValue(viewerItem, 'title');
      viewerCount.textContent = (viewerEvidenceIndex + 1) + ' / ' + viewerItem.evidence.length;
      viewerPrev.hidden = viewerItem.evidence.length < 2;
      viewerNext.hidden = viewerItem.evidence.length < 2;
      viewerPrev.disabled = viewerEvidenceIndex === 0;
      viewerNext.disabled = viewerEvidenceIndex === viewerItem.evidence.length - 1;
    }

    function openViewer(item, trigger) {
      hidePreview();
      viewerOpen = true;
      viewerItem = item;
      viewerEvidenceIndex = 0;
      viewerZoom = 1;
      viewerTrigger = trigger;
      renderViewer();
      if (!viewer.open) viewer.showModal();
      viewerClose.focus();
    }

    function closeViewer() {
      if (!viewer.open) return;
      viewer.close();
      viewerOpen = false;
      if (viewerTrigger && document.contains(viewerTrigger)) viewerTrigger.focus({ preventScroll: true });
      viewerTrigger = null;
    }

    function cycleEvidence(change) {
      if (!viewerItem) return;
      const next = viewerEvidenceIndex + change;
      if (next < 0 || next >= viewerItem.evidence.length) return;
      viewerEvidenceIndex = next;
      viewerZoom = 1;
      renderViewer();
    }

    heading.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'mouse' || !finePointerQuery.matches || viewerOpen) return;
      setState('hover-open');
    });
    heading.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse' || !finePointerQuery.matches) return;
      setState('closed');
    });
    toggle.addEventListener('click', function (event) {
      const keyboardActivation = event.detail === 0;
      if (finePointerQuery.matches && !keyboardActivation) return;
      if (state !== 'closed') setState('closed');
      else setState('hover-open');
    });
    closeCurtainButton.addEventListener('click', function () {
      setState('closed');
      toggle.focus({ preventScroll: true });
    });
    viewerClose.addEventListener('click', closeViewer);
    viewerPrev.addEventListener('click', function () { cycleEvidence(-1); });
    viewerNext.addEventListener('click', function () { cycleEvidence(1); });
    viewerZoomIn.addEventListener('click', function () { viewerZoom = Math.min(2.4, viewerZoom + .2); renderViewer(); });
    viewerZoomOut.addEventListener('click', function () { viewerZoom = Math.max(.8, viewerZoom - .2); renderViewer(); });
    viewer.addEventListener('cancel', function (event) { event.preventDefault(); closeViewer(); });
    viewer.addEventListener('click', function (event) { if (event.target === viewer) closeViewer(); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !viewerOpen && state !== 'closed') {
        event.preventDefault();
        setState('closed');
        toggle.focus({ preventScroll: true });
      }
    });
    window.addEventListener('resize', function () {
      window.requestAnimationFrame(setCurtainHeight);
      hidePreview();
    }, { passive: true });
    finePointerQuery.addEventListener('change', function () {
      setState('closed');
    });

    updateRichCopy();
    renderList();
    renderState();
    return {
      syncLanguage: function () {
        updateRichCopy();
        renderList();
        renderState();
        if (viewerOpen) renderViewer();
      }
    };
  }

  function initFadeIn() {
    const targets = Array.from(document.querySelectorAll('.work-item, .exp-card, .cap-card, .roles-panel, .detail-group, .honors-module'));
    if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
      targets.forEach(function (target) { target.classList.add('visible'); });
      return;
    }
    targets.forEach(function (target, index) {
      target.classList.add('fade-target');
      target.style.setProperty('--reveal-delay', (index % 4) * 60 + 'ms');
    });
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px' });
    targets.forEach(function (target) { observer.observe(target); });
  }

  function initHeroFloat() {
    const showcase = document.querySelector('[data-home-showcase]');
    if (!showcase) return;
    const floatingCards = Array.from(showcase.querySelectorAll('[data-hero-float]'));
    function reset() {
      floatingCards.forEach(function (card) {
        card.style.removeProperty('--float-x');
        card.style.removeProperty('--float-y');
      });
    }
    showcase.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse' || mobileQuery.matches || reduceMotionQuery.matches) return;
      const box = showcase.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width - .5) * 2;
      const y = ((event.clientY - box.top) / box.height - .5) * 2;
      floatingCards.forEach(function (card, index) {
        const depth = index ? 3.5 : 5;
        card.style.setProperty('--float-x', (x * depth).toFixed(2) + 'px');
        card.style.setProperty('--float-y', (y * depth).toFixed(2) + 'px');
      });
    });
    showcase.addEventListener('pointerleave', reset);
    mobileQuery.addEventListener('change', reset);
  }

  function initOpening() {
    const opening = document.querySelector('[data-opening]');
    const title = document.querySelector('.home-title');
    const panels = opening ? Array.from(opening.querySelectorAll('.opening-panel')) : [];
    let finished = false;
    let animations = [];
    let startTimer = 0;

    function cleanup() {
      if (finished) return;
      finished = true;
      window.clearTimeout(startTimer);
      if (window.__wenOpeningFallback) window.clearTimeout(window.__wenOpeningFallback);
      animations.forEach(function (animation) { animation.cancel(); });
      animations = [];
      document.documentElement.classList.remove('intro-pending', 'intro-ready');
      if (opening) {
        opening.hidden = true;
        opening.removeAttribute('style');
      }
      window.removeEventListener('resize', cleanup);
      window.removeEventListener('orientationchange', cleanup);
    }

    if (!opening || !title || reduceMotionQuery.matches) {
      cleanup();
      return;
    }

    const atHome = !window.location.hash || window.location.hash === '#home';
    const restoredAwayFromTop = window.scrollY > 8;
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem('wen-opening-seen') === '1';
      window.sessionStorage.setItem('wen-opening-seen', '1');
    } catch (_error) {}
    if (!atHome || restoredAwayFromTop || alreadySeen || !document.documentElement.classList.contains('intro-pending')) {
      cleanup();
      return;
    }

    opening.hidden = false;
    window.addEventListener('resize', cleanup, { once: true });
    window.addEventListener('orientationchange', cleanup, { once: true });

    const fontReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([
      fontReady,
      new Promise(function (resolve) { window.setTimeout(resolve, 180); })
    ]).then(function () {
      if (finished) return;
      const rect = title.getBoundingClientRect();
      const padX = mobileQuery.matches ? 8 : 16;
      const padY = mobileQuery.matches ? 7 : 10;
      const x = Math.max(0, rect.left - padX);
      const y = Math.max(0, rect.top - padY);
      const width = Math.min(window.innerWidth - x, rect.width + padX * 2);
      const height = Math.min(window.innerHeight - y, rect.height + padY * 2);

      opening.style.setProperty('--opening-x', x + 'px');
      opening.style.setProperty('--opening-y', y + 'px');
      opening.style.setProperty('--opening-w', width + 'px');
      opening.style.setProperty('--opening-h', height + 'px');

      window.requestAnimationFrame(function () {
        if (finished) return;
        document.documentElement.classList.add('intro-ready');
        startTimer = window.setTimeout(function () {
          if (finished) return;
          const motion = [
            ['translateY(0)', 'translateY(-105%)'],
            ['translateX(0)', 'translateX(105%)'],
            ['translateY(0)', 'translateY(105%)'],
            ['translateX(0)', 'translateX(-105%)']
          ];
          animations = panels.map(function (panel, index) {
            return panel.animate([
              { transform: motion[index][0] },
              { transform: motion[index][1] }
            ], {
              duration: 1040,
              easing: 'cubic-bezier(.76,0,.18,1)',
              fill: 'forwards'
            });
          });
          Promise.all(animations.map(function (animation) {
            return animation.finished.catch(function () {});
          })).then(cleanup);
        }, 220);
      });
    }).catch(cleanup);
  }

  navToggle.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });
  navAnchors.forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  langToggle.addEventListener('click', function () {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateLanguage();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false, true);
  });
  mobileQuery.addEventListener('change', syncMenuMode);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.querySelectorAll('[data-evidence-image]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const image = link.querySelector('img');
      openImageLightbox(link.href, image.alt, link);
    });
  });
  document.querySelector('[data-lightbox-close]').addEventListener('click', closeImageLightbox);
  document.querySelector('[data-qr-close]').addEventListener('click', function () { qrDialog.close(); });
  lightbox.addEventListener('cancel', function (event) {
    event.preventDefault();
    closeImageLightbox();
  });
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeImageLightbox();
  });
  qrDialog.addEventListener('click', function (event) {
    if (event.target === qrDialog) qrDialog.close();
  });

  const workList = document.querySelector('.work-list');
  const wenWork = document.getElementById('work-wen');
  const medicalWork = document.getElementById('work-medical');
  if (workList && wenWork && medicalWork && (medicalWork.compareDocumentPosition(wenWork) & Node.DOCUMENT_POSITION_FOLLOWING)) {
    workList.insertBefore(wenWork, medicalWork);
  }

  configureContact();
  configureProjectAssets();
  initJinchuanggu();
  kpopController = initKpop();
  medicalController = initMedicalCase();
  wenWorkspaceController = initWenWorkspace();
  bdtController = initBdt();
  roleExplorerController = initRoleExplorer();
  honorsController = initHonors();
  initOpening();
  initHeroFloat();
  updateLanguage();
  syncMenuMode();
  updateScrollState();
  initFadeIn();
})();
