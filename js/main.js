/**
 * Sets up Justified Gallery.
 */
if (!!$.prototype.justifiedGallery) {
  var options = {
    rowHeight: 140,
    margins: 4,
    lastRow: "justify"
  };
  $(".article-gallery").justifiedGallery(options);
}

$(document).ready(function () {

  /**
   * Mobile nav scroll fade indicator.
   * Hides the right-edge fade gradient when scrolled to the end.
   */
  function setupScrollFade(ulSelector, navSelector) {
    var ul = $(ulSelector);
    var nav = $(navSelector);

    function updateScrollState() {
      if (ul.length && ul[0].scrollWidth > ul[0].clientWidth) {
        // Has overflow, check scroll position
        var scrollLeft = ul[0].scrollLeft;
        var maxScroll = ul[0].scrollWidth - ul[0].clientWidth;

        if (scrollLeft >= maxScroll - 5) {
          nav.addClass("scrolled-end");
        } else {
          nav.removeClass("scrolled-end");
        }
      } else {
        // No overflow, hide the fade
        nav.addClass("scrolled-end");
      }
    }

    ul.on("scroll", updateScrollState);
    $(window).on("resize", updateScrollState);
    updateScrollState(); // Initial check
  }

  // Header nav
  setupScrollFade("#header > #nav > ul", "#header > #nav");

  // Footer nav
  setupScrollFade("#footer .footer-bottom nav ul", "#footer .footer-bottom nav");

  /**
   * Theme toggle elevation on mobile.
   * Moves the toggle button up gradually as user scrolls near page bottom.
   */
  var themeToggle = $(".theme-toggle");
  var minBottom = 16; // 1rem in pixels
  var maxBottom = 72; // 4.5rem in pixels
  var elevationZone = 100; // Start elevating when within 100px of bottom

  function updateThemeTogglePosition() {
    // Only apply on mobile viewport
    if (window.innerWidth > 480 || !themeToggle.length) {
      themeToggle.css("bottom", "");
      return;
    }

    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();
    var distanceFromBottom = documentHeight - scrollTop - windowHeight;

    var newBottom;
    if (distanceFromBottom >= elevationZone) {
      // Not near bottom, use default position
      newBottom = minBottom;
    } else if (distanceFromBottom <= 0) {
      // At the very bottom
      newBottom = maxBottom;
    } else {
      // Interpolate smoothly between min and max
      var progress = 1 - (distanceFromBottom / elevationZone);
      newBottom = minBottom + (maxBottom - minBottom) * progress;
    }

    themeToggle.css("bottom", newBottom + "px");
  }

  $(window).on("scroll", updateThemeTogglePosition);
  $(window).on("resize", updateThemeTogglePosition);
  updateThemeTogglePosition(); // Initial check

  /**
   * Shows the responsive navigation menu on mobile.
   */
  $("#header > #nav > ul > .icon").click(function () {
    $("#header > #nav > ul").toggleClass("responsive");
  });


  /**
   * Controls the TOC terminal box in blog post articles
   * for Desktop, tablet and mobile.
   */
  if ($(".post").length) {
    var menuIcon = $("#menu-icon, #menu-icon-tablet");
    var tocBox = $("#toc-terminal-box");
    var tocCloseBtn = $("#toc-close-btn");

    /**
     * Display the TOC box if the menu icon is clicked.
     */
    menuIcon.click(function () {
      tocBox.toggleClass("active");
      menuIcon.toggleClass("active");
      return false;
    });

    /**
     * Close TOC box when close button is clicked.
     */
    tocCloseBtn.click(function () {
      tocBox.removeClass("active");
      menuIcon.removeClass("active");
      return false;
    });




    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    if ($("#footer-post").length) {
      var lastScrollTop = 0;
      $(window).on("scroll", function () {
        var topDistance = $(window).scrollTop();

        if (topDistance > lastScrollTop) {
          // downscroll -> show menu
          $("#footer-post").hide();
        } else {
          // upscroll -> hide menu
          $("#footer-post").show();
        }
        lastScrollTop = topDistance;

        // close all submenu"s on scroll
        $("#nav-footer").hide();
        $("#toc-footer").hide();
        $("#share-footer").hide();

        // show a "navigation" icon when close to the top of the page, 
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          $("#actions-footer > #top").hide();
        } else if (topDistance > 100) {
          $("#actions-footer > #top").show();
        }
      });
    }
  }
});
