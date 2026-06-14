/* ============================================================
   SDL Image Reveal on Hover  v1.0
   No-class IIFE · reads Squarespace summary blocks
   ============================================================ */
(function () {
    'use strict';

    var CFG = window.SDL_REVEAL_CONFIG || {};

    var DEFAULTS = {
        imagePosition:    'center',
        contentLayout:    'title-left',
        showExcerpt:      true,
        showMeta:         true,
        showReadMore:     true,
        showIndex:        false,
        dimSiblings:      true,
        titleSlide:       true,
        hoverBg:          'transparent',
        dividerColor:     'rgba(0,0,0,0.1)',
        dividerWidth:     '1px',
        titleSize:        '32px',
        titleWeight:      '500',
        titleSpacing:     '-0.02em',
        titleColor:       'inherit',
        titleSizeMobile:  '22px',
        excerptSize:      '14px',
        excerptColor:     '#666',
        tagSize:          '12px',
        tagColor:         '#555',
        tagBg:            'transparent',
        tagBorderColor:   '#ccc',
        tagBorderWidth:   '1px',
        tagRadius:        '3px',
        readMoreText:     'View Project →',
        readMoreColor:    '#333',
        indexColor:       '#999',
        imgWidth:         '350px',
        imgHeight:        '250px',
        imgRadius:        '8px',
        imgShadow:        '0 12px 40px rgba(0,0,0,0.15)',
        rowPadY:          '28px',
        rowPadX:          '0',
        cursorOffsetX:    20,
        cursorOffsetY:    20
    };

    function opt(key) { return CFG[key] !== undefined ? CFG[key] : DEFAULTS[key]; }

    function setVars(el) {
        var map = {
            '--sdl-reveal-hover-bg':          opt('hoverBg'),
            '--sdl-reveal-divider-color':      opt('dividerColor'),
            '--sdl-reveal-divider-width':      opt('dividerWidth'),
            '--sdl-reveal-title-size':         opt('titleSize'),
            '--sdl-reveal-title-weight':       opt('titleWeight'),
            '--sdl-reveal-title-spacing':      opt('titleSpacing'),
            '--sdl-reveal-title-color':        opt('titleColor'),
            '--sdl-reveal-title-size-mobile':  opt('titleSizeMobile'),
            '--sdl-reveal-excerpt-size':       opt('excerptSize'),
            '--sdl-reveal-excerpt-color':      opt('excerptColor'),
            '--sdl-reveal-tag-size':           opt('tagSize'),
            '--sdl-reveal-tag-color':          opt('tagColor'),
            '--sdl-reveal-tag-bg':             opt('tagBg'),
            '--sdl-reveal-tag-border-color':   opt('tagBorderColor'),
            '--sdl-reveal-tag-border-width':   opt('tagBorderWidth'),
            '--sdl-reveal-tag-radius':         opt('tagRadius'),
            '--sdl-reveal-readmore-color':     opt('readMoreColor'),
            '--sdl-reveal-index-color':        opt('indexColor'),
            '--sdl-reveal-img-width':          opt('imgWidth'),
            '--sdl-reveal-img-height':         opt('imgHeight'),
            '--sdl-reveal-img-radius':         opt('imgRadius'),
            '--sdl-reveal-img-shadow':         opt('imgShadow'),
            '--sdl-reveal-row-pad-y':          opt('rowPadY'),
            '--sdl-reveal-row-pad-x':          opt('rowPadX')
        };
        for (var k in map) el.style.setProperty(k, map[k]);
    }

    function extractItems(block) {
        var items = block.querySelectorAll('.summary-item');
        var data = [];
        items.forEach(function (item, idx) {
            var img = item.querySelector('.summary-thumbnail-image');
            var titleLink = item.querySelector('.summary-title-link');
            var excerpt = item.querySelector('.summary-excerpt p, .summary-excerpt');
            var readMore = item.querySelector('.summary-read-more-link');
            var cats = item.querySelectorAll('.summary-metadata-item--cats a');
            var tags = item.querySelectorAll('.summary-metadata-item--tags a');

            var imgSrc = '';
            if (img) imgSrc = img.getAttribute('data-src') || img.src || '';

            var catSet = {};
            cats.forEach(function (a) { catSet[a.textContent.trim()] = true; });
            tags.forEach(function (a) { catSet[a.textContent.trim()] = true; });
            var metaArr = Object.keys(catSet);

            data.push({
                title:    titleLink ? titleLink.textContent.trim() : '',
                href:     titleLink ? titleLink.href : '#',
                imgSrc:   imgSrc,
                excerpt:  excerpt ? excerpt.textContent.trim() : '',
                readMore: readMore ? readMore.href : (titleLink ? titleLink.href : '#'),
                meta:     metaArr,
                index:    idx + 1
            });
        });
        return data;
    }

    function buildUI(block, items) {
        var container = document.createElement('div');
        container.className = 'sdl-reveal';

        container.classList.add('sdl-reveal--img-' + opt('imagePosition'));
        container.classList.add('sdl-reveal--layout-' + opt('contentLayout'));
        if (opt('dimSiblings')) container.classList.add('sdl-reveal--dim-siblings');
        if (opt('titleSlide'))  container.classList.add('sdl-reveal--title-slide');

        setVars(container);

        items.forEach(function (d) {
            var row = document.createElement('a');
            row.className = 'sdl-reveal-row';
            row.href = d.href;

            var inner = document.createElement('div');
            inner.className = 'sdl-reveal-row-inner';

            var left = document.createElement('div');
            left.className = 'sdl-reveal-left';

            if (opt('showIndex')) {
                var idx = document.createElement('span');
                idx.className = 'sdl-reveal-index';
                idx.textContent = String(d.index).padStart(2, '0');
                left.appendChild(idx);
            }

            var title = document.createElement('h3');
            title.className = 'sdl-reveal-title';
            title.textContent = d.title;
            left.appendChild(title);

            if (opt('showExcerpt') && d.excerpt) {
                var exc = document.createElement('p');
                exc.className = 'sdl-reveal-excerpt';
                exc.textContent = d.excerpt;
                left.appendChild(exc);
            }

            var right = document.createElement('div');
            right.className = 'sdl-reveal-right';

            if (opt('showMeta') && d.meta.length) {
                var metaWrap = document.createElement('div');
                metaWrap.className = 'sdl-reveal-meta';
                d.meta.forEach(function (m) {
                    var tag = document.createElement('span');
                    tag.className = 'sdl-reveal-tag';
                    tag.textContent = m;
                    metaWrap.appendChild(tag);
                });
                right.appendChild(metaWrap);
            }

            if (opt('showReadMore')) {
                var rm = document.createElement('span');
                rm.className = 'sdl-reveal-readmore';
                rm.textContent = opt('readMoreText');
                right.appendChild(rm);
            }

            if (opt('contentLayout') === 'spread') {
                var center = document.createElement('div');
                center.className = 'sdl-reveal-center';
                if (right.querySelector('.sdl-reveal-meta')) {
                    center.appendChild(right.querySelector('.sdl-reveal-meta'));
                }
                inner.appendChild(left);
                inner.appendChild(center);
                inner.appendChild(right);
            } else {
                inner.appendChild(left);
                inner.appendChild(right);
            }

            // Image element
            if (d.imgSrc) {
                var imgWrap = document.createElement('div');
                imgWrap.className = 'sdl-reveal-image';
                var img = document.createElement('img');
                img.src = d.imgSrc;
                img.alt = d.title;
                img.loading = 'lazy';
                imgWrap.appendChild(img);
                row.appendChild(imgWrap);
            }

            row.appendChild(inner);
            container.appendChild(row);
        });

        block.parentNode.insertBefore(container, block.nextSibling);
        block.closest('.sqs-block-summary-v2').classList.add('sdl-reveal-ready');

        if (opt('imagePosition') === 'cursor') {
            bindCursorFollow(container);
        }
    }

    function bindCursorFollow(container) {
        var rows = container.querySelectorAll('.sdl-reveal-row');
        var offX = opt('cursorOffsetX');
        var offY = opt('cursorOffsetY');

        rows.forEach(function (row) {
            var imgEl = row.querySelector('.sdl-reveal-image');
            if (!imgEl) return;

            var rafId = null;
            var targetX = 0, targetY = 0;
            var currentX = 0, currentY = 0;

            function lerp(a, b, t) { return a + (b - a) * t; }

            function animate() {
                currentX = lerp(currentX, targetX, 0.12);
                currentY = lerp(currentY, targetY, 0.12);
                imgEl.style.left = currentX + 'px';
                imgEl.style.top  = currentY + 'px';
                rafId = requestAnimationFrame(animate);
            }

            row.addEventListener('mouseenter', function () {
                rafId = requestAnimationFrame(animate);
            });

            row.addEventListener('mousemove', function (e) {
                targetX = e.clientX + offX;
                targetY = e.clientY + offY;
            });

            row.addEventListener('mouseleave', function () {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
            });
        });
    }

    function init() {
        var blocks = document.querySelectorAll('.sqs-block-summary-v2');
        if (!blocks.length) return;

        blocks.forEach(function (block) {
            if (block.classList.contains('sdl-reveal-ready')) return;
            var items = extractItems(block);
            if (!items.length) return;
            buildUI(block, items);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', init);
})();
