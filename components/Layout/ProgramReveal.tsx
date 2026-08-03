'use client'
import React, {FunctionComponent, PropsWithChildren, useEffect, useLayoutEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {classNames} from '@/components/utils/classNames';
import styles from '@/styles/homepage.module.scss';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Each group animates as one unit when it scrolls into view: the page title, every
// month header and every program row.
const GROUP_SELECTOR = '[data-reveal-group]';
// Flowing text — split into lines, each line masked by its own clipping box.
const TEXT_SELECTOR = '[data-reveal="text"]';
// Pills and buttons — they rise as a whole out of the mask wrapper around them.
const BOX_SELECTOR = '[data-reveal="box"]';

// SplitText adds these as plain (non-module) class names, so the SCSS that styles
// them has to reach for them with :global().
const LINE_CLASS = 'revealLine';

// Fonts are `font-display: swap`, so splitting before they load measures the
// fallback metrics and produces wrong line breaks. Wait for them — but never hide
// the programme indefinitely if the font promise stalls.
const FONT_TIMEOUT_MS = 1500;

// Absolute backstop: the pre-hide must never outlive this, whatever goes wrong.
const SAFETY_TIMEOUT_MS = 3000;

const ProgramReveal: FunctionComponent<PropsWithChildren<{ readonly className?: string }>> = (
    {children, className}
) => {
    const rootRef = useRef<HTMLDivElement>(null);

    // The programme renders hidden until the from-state is in place, so nothing
    // flashes at full opacity before the reveal starts. Cleared as soon as the
    // first build finishes (or immediately when motion is reduced).
    const [pending, setPending] = useState(true);

    useIsomorphicLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        gsap.registerPlugin(ScrollTrigger, SplitText);

        // Respect reduced motion: no splitting, no animation, content just shows.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPending(false);
            return;
        }

        let cancelled = false;
        let splits: SplitText[] = [];
        let triggers: ScrollTrigger[] = [];
        // Groups that have already played. A re-split (resize) must leave them
        // visible rather than replaying their reveal.
        const revealed = new Set<Element>();

        const teardown = () => {
            triggers.forEach(t => t.kill());
            triggers = [];
            splits.forEach(s => s.revert());
            splits = [];
        };

        const build = () => {
            if (cancelled) return;
            teardown();

            try {
                splitAndAnimate();
            } catch (error) {
                // Never let a failed split leave the programme stuck behind the
                // pre-hide: drop the masks and show the text as-is.
                console.error('Program reveal failed, showing content unanimated', error);
                teardown();
            } finally {
                setPending(false);
            }
        };

        const splitAndAnimate = () => {
            root.querySelectorAll<HTMLElement>(GROUP_SELECTOR).forEach(group => {
                const textTargets = [
                    ...(group.matches(TEXT_SELECTOR) ? [group] : []),
                    ...Array.from(group.querySelectorAll<HTMLElement>(TEXT_SELECTOR)),
                ];

                const lines: Element[] = [];
                textTargets.forEach(el => {
                    const split = SplitText.create(el, {
                        type: 'lines',
                        mask: 'lines',
                        linesClass: LINE_CLASS,
                    });
                    splits.push(split);
                    lines.push(...split.lines);
                });

                const targets = [...lines, ...Array.from(group.querySelectorAll<HTMLElement>(BOX_SELECTOR))];
                if (targets.length === 0) return;

                // Already seen by the reader — keep it in place across re-splits.
                if (revealed.has(group)) {
                    gsap.set(targets, {yPercent: 0});
                    return;
                }

                gsap.set(targets, {yPercent: 110});
                const tween = gsap.to(targets, {
                    yPercent: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 88%',
                        once: true,
                        onEnter: () => revealed.add(group),
                    },
                });
                if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
            });

            ScrollTrigger.refresh();
        };

        // Re-split on width changes only: on mobile the viewport *height* changes
        // constantly as the browser UI bar hides, and rebuilding on that would be
        // both pointless and janky.
        let lastWidth = window.innerWidth;
        let resizeTimer: number | undefined;
        const onResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(build, 200);
        };

        const fontTimeout = window.setTimeout(build, FONT_TIMEOUT_MS);
        document.fonts.ready.then(() => {
            window.clearTimeout(fontTimeout);
            build();
        });

        // Last resort: whatever happens above, the programme must become visible.
        const safetyTimeout = window.setTimeout(() => setPending(false), SAFETY_TIMEOUT_MS);

        window.addEventListener('resize', onResize);

        return () => {
            cancelled = true;
            window.clearTimeout(fontTimeout);
            window.clearTimeout(safetyTimeout);
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            teardown();
        };
    }, []);

    return (
        <>
            {/* Without JS the reveal never runs, so the pre-hide must not stick. */}
            <noscript>
                <style>{`.${styles.revealPending}{visibility:visible!important}`}</style>
            </noscript>
            <div ref={rootRef} className={classNames([className, pending && styles.revealPending])}>
                {children}
            </div>
        </>
    );
};

export default ProgramReveal;
