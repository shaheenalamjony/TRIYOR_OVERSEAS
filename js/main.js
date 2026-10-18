/**
 * Triyor Overseas - Interactive JavaScript & jQuery Logic
 * Authors: Senior Full-Stack & UI/UX Engineering
 */

$(document).ready(function () {
  'use strict';

  // ==========================================================
  // 1. Sticky Navigation Bar
  // ==========================================================
  const $navbar = $('#mainNavbar');
  const $backToTop = $('#backToTop');

  $(window).on('scroll', function () {
    const scrollPos = $(this).scrollTop();

    if (scrollPos > 120) {
      $navbar.addClass('navbar-sticky');
      $backToTop.addClass('active');
    } else {
      $navbar.removeClass('navbar-sticky');
      $backToTop.removeClass('active');
    }
  });

  // Back to Top Smooth Scroll
  $backToTop.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  // ==========================================================
  // 2. Hero Background Video Handling & Controls
  // ==========================================================
  const heroVideo = document.getElementById('heroBgVideo');
  const $videoToggleBtn = $('#videoToggleBtn');

  if (heroVideo) {
    // Attempt autoplay
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function (error) {
        console.log('Video autoplay prevented by browser policy:', error);
        $videoToggleBtn.html('<i class="fas fa-play"></i> Play Video');
      });
    }

    $videoToggleBtn.on('click', function () {
      if (heroVideo.paused) {
        heroVideo.play();
        $(this).html('<i class="fas fa-pause"></i> Pause Video');
      } else {
        heroVideo.pause();
        $(this).html('<i class="fas fa-play"></i> Play Video');
      }
    });
  }

  // ==========================================================
  // 3. Destination Filter Tabs
  // ==========================================================
  $('.filter-pill').on('click', function () {
    $('.filter-pill').removeClass('active');
    $(this).addClass('active');

    const filterVal = $(this).attr('data-filter');

    if (filterVal === 'all') {
      $('.destination-item').fadeIn(300);
    } else {
      $('.destination-item').hide();
      $('.destination-item[data-region="' + filterVal + '"]').fadeIn(300);
    }
  });

  // ==========================================================
  // 4. Interactive Counter Animation
  // ==========================================================
  let countersTriggered = false;
  const $counterSection = $('#heroStatsBar');

  function runCounters() {
    $('.stat-value').each(function () {
      const $this = $(this);
      const target = parseFloat($this.attr('data-count'));
      const isDecimal = target % 1 !== 0;
      const suffix = $this.attr('data-suffix') || '';

      $({ countNum: 0 }).animate(
        { countNum: target },
        {
          duration: 2000,
          easing: 'swing',
          step: function () {
            if (isDecimal) {
              $this.text(this.countNum.toFixed(1) + suffix);
            } else {
              $this.text(Math.floor(this.countNum) + suffix);
            }
          },
          complete: function () {
            if (isDecimal) {
              $this.text(target.toFixed(1) + suffix);
            } else {
              $this.text(target + suffix);
            }
          }
        }
      );
    });
  }

  // Trigger counters on first scroll or page load
  if ($counterSection.length) {
    $(window).on('scroll.counterScroll', function () {
      const hT = $counterSection.offset().top;
      const hH = $counterSection.outerHeight();
      const wH = $(window).height();
      const wS = $(this).scrollTop();

      if (wS > hT + hH - wH && !countersTriggered) {
        countersTriggered = true;
        runCounters();
        $(window).off('scroll.counterScroll');
      }
    });

    // If already in view on load
    if ($(window).scrollTop() + $(window).height() >= $counterSection.offset().top) {
      countersTriggered = true;
      runCounters();
    }
  }

  // ==========================================================
  // 5. FAQ Search Filter
  // ==========================================================
  $('#faqSearchInput').on('keyup', function () {
    const value = $(this).val().toLowerCase();
    $('#faqAccordion .accordion-item').filter(function () {
      const text = $(this).text().toLowerCase();
      const isMatch = text.indexOf(value) > -1;
      $(this).toggle(isMatch);
    });
  });

  // ==========================================================
  // 6. Free Consultation Form Submission (AJAX simulation)
  // ==========================================================
  $('#consultationForm').on('submit', function (e) {
    e.preventDefault();

    const $form = $(this);
    const $submitBtn = $form.find('button[type="submit"]');
    const originalBtnText = $submitBtn.html();

    // Basic HTML5 validation check
    if (!this.checkValidity()) {
      e.stopPropagation();
      $form.addClass('was-validated');
      return;
    }

    // Processing State
    $submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i> Submitting Request...');

    setTimeout(function () {
      $submitBtn.prop('disabled', false).html(originalBtnText);
      $form.removeClass('was-validated');
      $form[0].reset();

      // Show Bootstrap Modal confirmation
      const successModal = new bootstrap.Modal(document.getElementById('submissionSuccessModal'));
      successModal.show();
    }, 1200);
  });

  // Quick Modal Booking Form Handler
  $('#modalConsultationForm').on('submit', function (e) {
    e.preventDefault();
    const $form = $(this);
    const $btn = $form.find('button[type="submit"]');
    const origText = $btn.html();

    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i> Booking...');

    setTimeout(function () {
      $btn.prop('disabled', false).html(origText);
      $form[0].reset();

      // Close consultation modal and show success
      const consultModalEl = document.getElementById('consultationModal');
      const consultModal = bootstrap.Modal.getInstance(consultModalEl);
      if (consultModal) {
        consultModal.hide();
      }

      const successModal = new bootstrap.Modal(document.getElementById('submissionSuccessModal'));
      successModal.show();
    }, 1000);
  });

  // ==========================================================
  // 7. Smooth Anchor Scroll & Mobile Menu Close
  // ==========================================================
  $('a[href^="#"]:not([href="#"]):not([data-bs-toggle])').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      const headerOffset = 75;
      const elementPosition = target.offset().top;
      const offsetPosition = elementPosition - headerOffset;

      $('html, body').animate(
        {
          scrollTop: offsetPosition
        },
        500
      );

      // Close mobile offcanvas drawer if open
      const offcanvasEl = document.getElementById('mobileOffcanvasNav');
      if (offcanvasEl) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }

      // Close mobile navbar collapse if open
      if ($('.navbar-collapse').hasClass('show')) {
        $('.navbar-toggler').click();
      }
    }
  });

  // ==========================================================
  // 8. Set Dynamic Destination in Modal
  // ==========================================================
  $('.btn-apply-dest').on('click', function () {
    const destName = $(this).attr('data-country') || 'General';
    $('#modalPreferredCountry').val(destName);
  });

  // ==========================================================
  // 9. AI Chatbot Widget Logic
  // ==========================================================
  const $aiChatToggle = $('#aiChatToggle');
  const $aiChatWindow = $('#aiChatWindow');
  const $aiChatClose = $('#aiChatClose');
  const $aiChatForm = $('#aiChatForm');
  const $aiChatInput = $('#aiChatInput');
  const $aiChatMessages = $('#aiChatMessages');
  const $avatarCircle = $aiChatToggle.find('.counselor-avatar-circle');
  const $iconClose = $aiChatToggle.find('.counselor-icon-close');
  const $hintBubble = $('.counselor-hint-bubble');
  const counselorImg = 'images/rezowan-ahmed-joy.jpg';
  const whatsappNumber = '8801327308156';

  function scrollToBottom() {
    $aiChatMessages.stop().animate({
      scrollTop: $aiChatMessages[0].scrollHeight
    }, 300);
  }

  function toggleCounselorChat() {
    if ($aiChatWindow.is(':visible')) {
      $aiChatWindow.fadeOut(200);
      $iconClose.hide();
      $avatarCircle.show();
      $hintBubble.fadeIn(300);
    } else {
      $aiChatWindow.fadeIn(250);
      $avatarCircle.hide();
      $iconClose.show();
      $hintBubble.hide();
      $aiChatInput.focus();
      scrollToBottom();
    }
  }

  $aiChatToggle.on('click', toggleCounselorChat);
  $aiChatClose.on('click', toggleCounselorChat);
  $('#mobileBottomCounselorBtn').on('click', toggleCounselorChat);

  // Format current time (e.g., 1:35 PM)
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Empathetic, Human Counselor Response Generator
  function generateCounselorResponse(userText) {
    const text = userText.toLowerCase().trim();

    let reply = '';

    if (text.includes('scholarship') || text.includes('বৃত্তি') || text.includes('fund')) {
      reply = `Hello! I would be delighted to help you explore scholarship options. Depending on your CGPA and IELTS/Duolingo scores, we can target <strong>merit scholarships and tuition waivers ranging from 20% up to 100%</strong> in the USA, UK, Canada, Australia, and Nordic nations like Finland!`;
    } else if (text.includes('visa') || text.includes('ভিসা') || text.includes('document')) {
      reply = `Visa preparation is our core specialty! I personally review your financial sponsor files, guide you with your SOP/Cover Letter, and conduct <strong>1-on-1 mock embassy interview drills</strong> so you feel 100% confident facing the visa officer. Our success rate is currently 98.6%.`;
    } else if (text.includes('uk') || text.includes('usa') || text.includes('canada') || text.includes('australia') || text.includes('country') || text.includes('দেশ')) {
      reply = `Excellent choice! Each country has unique advantages: the <strong>UK offers 1-year Master's + 2-year PSW</strong>, the <strong>USA provides 3-year STEM OPT</strong>, and <strong>Canada & Australia offer direct PR points pathways</strong>. I can recommend specific universities tailored to your budget!`;
    } else if (text.includes('ielts') || text.includes('duolingo') || text.includes('moi') || text.includes('waiver') || text.includes('english')) {
      reply = `Good news! If you have a Medium of Instruction (MOI) certificate from your previous university, or if you prefer the <strong>Duolingo English Test (DET) / PTE</strong>, several prestigious universities in the UK and USA accept them with full admission eligibility!`;
    } else if (text.includes('cost') || text.includes('fee') || text.includes('খরচ') || text.includes('budget')) {
      reply = `All our counseling and profile evaluation sessions are <strong>completely free</strong> of charge. University tuition fees vary by country (e.g., £12,000–£16,000 in the UK, $15,000–$25,000 in the USA), and I will help shortlist options that comfortably fit your financial plan.`;
    } else {
      reply = `Thank you so much for sharing that! As your dedicated senior counselor, I will personally guide you through every stage — from choosing the right university and course to securing your admission offer, scholarship, and student visa.`;
    }

    // Warm Human Support & Development Phase note with direct WhatsApp link
    const supportNotice = `
      <div class="counselor-dev-card">
        <strong>💬 সরাসরি কাউন্সেলিং সহায়তা:</strong><br>
        আমাদের অনলাইন সিস্টেমটি বর্তমানে উন্নয়নমূলক পর্যায়ে (Development Phase) রয়েছে। আপনার সার্টিফিকেট বা সিভি সরাসরি আমার হোয়াটসঅ্যাপে পাঠিয়ে <strong>ফ্রি প্রোফাইল অ্যাসেসমেন্ট</strong> নিতে পারেন:
        <div class="mt-2">
          <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Assalamu Alaikum Rezowan Bhai, I am interested in: ' + userText + '. Can you evaluate my profile?')}" target="_blank" rel="noopener" class="human-whatsapp-btn">
            <i class="fab fa-whatsapp"></i> WhatsApp-এ রেজোয়ান ভাইয়ের সাথে কথা বলুন
          </a>
        </div>
      </div>
    `;

    return `<p class="mb-1">${reply}</p>${supportNotice}<span class="human-msg-time">${getCurrentTime()}</span>`;
  }

  function handleHumanMessage(msgText) {
    if (!msgText || !msgText.trim()) return;

    // Append User Message with human time
    const userMsgHtml = `
      <div class="human-msg human-msg-user">
        <div class="human-msg-bubble">
          <p class="mb-0">${$('<div/>').text(msgText).html()}</p>
          <span class="human-msg-time">${getCurrentTime()}</span>
        </div>
      </div>
    `;
    $aiChatMessages.append(userMsgHtml);
    $aiChatInput.val('');
    scrollToBottom();

    // Show Human Typing Indicator
    const typingId = 'typing-' + Date.now();
    const typingHtml = `
      <div class="human-msg human-msg-counselor" id="${typingId}">
        <div class="human-msg-avatar">
          <img src="${counselorImg}" alt="Rezowan Joy">
        </div>
        <div class="human-msg-bubble text-muted small py-2 px-3">
          <span class="me-2 text-navy fw-semibold" style="font-size:0.8rem;">Rezowan is typing</span>
          <span class="typing-dots">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </span>
        </div>
      </div>
    `;
    $aiChatMessages.append(typingHtml);
    scrollToBottom();

    // Realistic human response delay (800ms)
    setTimeout(function () {
      $('#' + typingId).remove();

      const botReply = generateCounselorResponse(msgText);
      const counselorMsgHtml = `
        <div class="human-msg human-msg-counselor">
          <div class="human-msg-avatar">
            <img src="${counselorImg}" alt="Tanjina">
          </div>
          <div class="human-msg-bubble">
            ${botReply}
          </div>
        </div>
      `;
      $aiChatMessages.append(counselorMsgHtml);
      scrollToBottom();
    }, 850);
  }

  $aiChatForm.on('submit', function (e) {
    e.preventDefault();
    const text = $aiChatInput.val();
    handleHumanMessage(text);
  });

  // Quick Action Chips Click
  $(document).on('click', '.human-chip, .ai-chip', function () {
    const question = $(this).attr('data-question') || $(this).text();
    handleHumanMessage(question);
  });

  // ==========================================================
  // 10. Animated 5-Step Roadmap Interaction
  // ==========================================================
  const $stepCards = $('.process-step-card');
  const $trackProgress = $('#processTrackProgress');
  const $trackGlow = $('.process-track-glow');

  // Interactive Hover Progress Flow
  $stepCards.on('mouseenter', function () {
    const stepNum = parseInt($(this).attr('data-step'), 10) || 1;
    // Map steps 1-5 to percentage along connecting track (0% to 100%)
    const pct = ((stepNum - 1) / 4) * 100;
    
    if ($trackGlow.length) {
      $trackGlow.css({
        'left': pct + '%',
        'transition': 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      });
    }

    // Highlight previous steps in sequence
    $stepCards.each(function () {
      const currentStep = parseInt($(this).attr('data-step'), 10);
      if (currentStep < stepNum) {
        $(this).css('opacity', '0.85');
      } else if (currentStep === stepNum) {
        $(this).css('opacity', '1');
      } else {
        $(this).css('opacity', '0.7');
      }
    });
  });

  $('.process-roadmap-wrapper').on('mouseleave', function () {
    $stepCards.css('opacity', '1');
    if ($trackGlow.length) {
      $trackGlow.css({
        'transition': ''
      });
    }
  });

  // Quick action: clicking any step opens Consultation Modal
  $stepCards.on('click', function () {
    const stepTitle = $(this).find('.process-step-title').text();
    const modalEl = document.getElementById('consultationModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  });

  // Staggered Scroll Entrance Animation
  if ('IntersectionObserver' in window) {
    const roadmapObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            $stepCards.each(function (idx) {
              const $card = $(this);
              setTimeout(function () {
                $card.addClass('roadmap-animated-in');
              }, idx * 140);
            });
            roadmapObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const roadmapSection = document.getElementById('how-it-works');
    if (roadmapSection) {
      roadmapObserver.observe(roadmapSection);
    }
  }
});
