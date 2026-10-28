'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './AllyOpenFilm.module.css';

/*
 * Little Ally opens the chat. 700×500 native canvas, 7.19 s loop. Every position is a literal px value in canvas space.
 * The Uppdrag page is laid out twice: once at 6× its size for the close-up (MACRO — drawn big, not scaled up),
 * once at 0.4375 px per page px (WORLD — the design's 1600-wide page at 700) for the camera's 150% / 200% shots.
 *
 *   0.00  1 Närbild  close-up on the corner: little Ally floats (3 s bob); 1.06 the pointer fades in,
 *                    1.38 it taps her — she springs and ripples
 *   1.50  2 Chatt    hard cut out to 150%: the chat panel rises in over her and she exits; 1.82 the pointer leaves,
 *                    the field turns ink; 1.92 the question types (55 ms a character); 3.665 send is pressed;
 *                    3.785 the question lands; 4.085 the answer rises in (80 ms apart)
 *   4.69  3 Källa    hard cut to 200% on the answer; 4.94 the pointer fades in on the citation, 5.26 taps it,
 *                    5.38 the source rises off it and the answer dims
 *   7.19  loop       hard cut back to the close-up
 */

type El =
  | { k: 'box'; s: CSSProperties }
  | { k: 'text'; s: CSSProperties; t: string }
  | { k: 'svg'; s: CSSProperties; vb: string; sw: number; stroke: boolean; p: (string | null)[][] };

/* Generated from the design. WORLD at 0.4375 canvas px per page px. */
const WORLD: Record<string, El[]> = {
  page: [
    { k: 'box', s: {"left": 3.5, "top": 3.5, "width": 693.0, "height": 492.62, "backgroundImage": "radial-gradient(300% 200% at 130% 90%, rgb(206, 178, 244) 0%, rgb(242, 242, 243) 50%)"} },
    { k: 'box', s: {"left": 3.5, "top": 3.5, "width": 693.0, "height": 21.88, "borderBottom": "0.438px solid rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 38.5, "top": 8.97, "width": 0.44, "height": 10.5, "backgroundColor": "rgb(231, 233, 236)"} },
    { k: 'box', s: {"left": 7.0, "top": 28.88, "width": 686.0, "height": 20.99, "backgroundColor": "rgba(255, 255, 255, 0.6)", "border": "0.438px solid rgb(255, 255, 255)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 631.75, "top": 53.37, "width": 61.25, "height": 439.26, "backgroundColor": "rgba(255, 255, 255, 0.6)", "border": "0.438px solid rgb(255, 255, 255)", "borderRadius": "1.75px", "backdropFilter": "blur(2.625px)"} },
    { k: 'box', s: {"left": 635.69, "top": 57.3, "width": 53.38, "height": 26.25, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 635.69, "top": 85.3, "width": 53.38, "height": 26.25, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 635.69, "top": 113.3, "width": 53.38, "height": 26.25, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 635.69, "top": 141.3, "width": 53.38, "height": 26.25, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 635.69, "top": 169.3, "width": 53.38, "height": 26.25, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 635.69, "top": 197.3, "width": 53.38, "height": 26.25, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 635.69, "top": 225.3, "width": 53.38, "height": 26.25, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'text', s: {"left": 47.69, "top": 10.72, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "Hedvigs företag" },
    { k: 'text', s: {"left": 14.44, "top": 35.88, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(22, 119, 255)"}, t: "Uppdrag" },
    { k: 'text', s: {"left": 50.55, "top": 35.88, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(16, 24, 41)"}, t: "Lagstadgad revision: 2025-12" },
    { k: 'text', s: {"left": 639.62, "top": 73.93, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Allmänt" },
    { k: 'text', s: {"left": 639.62, "top": 101.93, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Väsentlighet" },
    { k: 'text', s: {"left": 639.62, "top": 118.99, "fontSize": 8.75, "lineHeight": "8.75px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "letterSpacing": "-0.088px"}, t: "2" },
    { k: 'text', s: {"left": 639.62, "top": 129.93, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Fokusområden" },
    { k: 'text', s: {"left": 639.62, "top": 146.99, "fontSize": 8.75, "lineHeight": "8.75px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "letterSpacing": "-0.088px"}, t: "3" },
    { k: 'text', s: {"left": 639.62, "top": 157.93, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Noteringar" },
    { k: 'text', s: {"left": 639.62, "top": 174.99, "fontSize": 8.75, "lineHeight": "8.75px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "letterSpacing": "-0.088px"}, t: "14" },
    { k: 'text', s: {"left": 639.62, "top": 185.93, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Bevis" },
    { k: 'text', s: {"left": 639.62, "top": 213.93, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Guider" },
    { k: 'text', s: {"left": 639.62, "top": 241.93, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Hjälp" },
    { k: 'svg', s: {"left": 14.0, "top": 11.63, "width": 17.5, "height": 5.16, "color": "rgb(16, 24, 41)"}, vb: "0 0 61 18", sw: 0, stroke: false, p: [["currentColor", "M49.2514 4.02592C50.3559 4.02592 51.2488 3.1305 51.2456 2.02593C51.2423 0.921367 50.3443 0.0259399 49.2397 0.0259399C48.1352 0.0259399 47.2423 0.921367 47.2456 2.02593C47.2488 3.1305 48.1468 4.02592 49.2514 4.02592Z"], ["currentColor", "M44.3383 10.9275C45.4428 10.9275 46.3357 10.0321 46.3325 8.92751C46.3293 7.82295 45.4312 6.92752 44.3267 6.92752C43.2221 6.92752 42.3293 7.82295 42.3325 8.92751C42.3357 10.0321 43.2337 10.9275 44.3383 10.9275Z"], ["currentColor", "M40.1391 17.7849C41.2292 17.6065 41.9656 16.5786 41.784 15.489C41.6024 14.3995 40.5715 13.6609 39.4814 13.8394C38.3914 14.0178 37.6549 15.0457 37.8365 16.1353C38.0181 17.2248 39.049 17.9634 40.1391 17.7849Z"], ["currentColor", "M54.242 10.884C55.3465 10.884 56.2394 9.98856 56.2362 8.88399C56.2329 7.77943 55.3349 6.884 54.2303 6.884C53.1258 6.884 52.2329 7.77943 52.2362 8.88399C52.2394 9.98856 53.1374 10.884 54.242 10.884Z"], ["currentColor", "M58.7489 17.7414C59.8535 17.7414 60.7463 16.846 60.7431 15.7414C60.7399 14.6369 59.8419 13.7414 58.7373 13.7414C57.6327 13.7414 56.7399 14.6369 56.7431 15.7414C56.7463 16.846 57.6444 17.7414 58.7489 17.7414Z"], ["currentColor", "M30.3801 4.02592C31.4847 4.02592 32.3775 3.1305 32.3743 2.02593C32.3711 0.921367 31.4731 0.0259399 30.3685 0.0259399C29.264 0.0259399 28.3711 0.921367 28.3743 2.02593C28.3775 3.1305 29.2756 4.02592 30.3801 4.02592Z"], ["currentColor", "M25.4656 10.9277C26.5702 10.9277 27.463 10.0323 27.4598 8.92773C27.4566 7.82316 26.5585 6.92773 25.454 6.92773C24.3494 6.92773 23.4566 7.82316 23.4598 8.92773C23.463 10.0323 24.361 10.9277 25.4656 10.9277Z"], ["currentColor", "M20.96 17.7863C22.0646 17.7863 22.9574 16.8908 22.9542 15.7863C22.951 14.6817 22.0529 13.7863 20.9484 13.7863C19.8438 13.7863 18.951 14.6817 18.9542 15.7863C18.9574 16.8908 19.8554 17.7863 20.96 17.7863Z"], ["currentColor", "M35.3706 10.8837C36.4752 10.8837 37.368 9.98828 37.3648 8.88372C37.3616 7.77915 36.4636 6.88373 35.359 6.88373C34.2544 6.88373 33.3616 7.77915 33.3648 8.88372C33.368 9.98828 34.2661 10.8837 35.3706 10.8837Z"], ["currentColor", "M11.426 4.0258C12.5306 4.0258 13.4234 3.13037 13.4202 2.02581C13.417 0.921245 12.519 0.0258179 11.4144 0.0258179C10.3099 0.0258179 9.41703 0.921245 9.42024 2.02581C9.42345 3.13037 10.3215 4.0258 11.426 4.0258Z"], ["currentColor", "M6.5115 10.9277C7.61607 10.9277 8.5089 10.0322 8.50569 8.92766C8.50248 7.8231 7.60445 6.92767 6.49988 6.92767C5.39531 6.92767 4.50248 7.8231 4.50569 8.92766C4.5089 10.0322 5.40693 10.9277 6.5115 10.9277Z"], ["currentColor", "M2.00588 17.7877C3.11045 17.7877 4.00328 16.8922 4.00007 15.7877C3.99686 14.6831 3.09883 13.7877 1.99426 13.7877C0.889693 13.7877 -0.00313623 14.6831 7.23695e-05 15.7877C0.00328097 16.8922 0.901313 17.7877 2.00588 17.7877Z"], ["currentColor", "M16.4166 10.8838C17.5212 10.8838 18.414 9.98841 18.4108 8.88384C18.4076 7.77928 17.5096 6.88385 16.405 6.88385C15.3005 6.88385 14.4076 7.77928 14.4108 8.88384C14.414 9.98841 15.3121 10.8838 16.4166 10.8838Z"]] },
    { k: 'svg', s: {"left": 96.39, "top": 11.59, "width": 5.25, "height": 5.25, "color": "rgba(16, 24, 41, 0.7)"}, vb: "0 0 1024 1024", sw: 56.0, stroke: true, p: [[null, "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"]] },
    { k: 'svg', s: {"left": 634.38, "top": 9.84, "width": 8.75, "height": 8.75, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"]] },
    { k: 'svg', s: {"left": 655.38, "top": 9.84, "width": 8.75, "height": 8.75, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M518.3 459a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"], [null, "M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"]] },
    { k: 'svg', s: {"left": 41.8, "top": 36.74, "width": 5.25, "height": 5.25, "color": "rgba(16, 24, 41, 0.7)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"]] },
  ],
  tablepanel: [
    { k: 'box', s: {"left": 7.0, "top": 53.37, "width": 621.25, "height": 439.26, "backgroundColor": "rgba(255, 255, 255, 0.6)", "border": "0.438px solid rgb(255, 255, 255)", "borderRadius": "1.75px"} },
  ],
  table: [
    { k: 'box', s: {"left": 14.44, "top": 60.8, "width": 606.38, "height": 31.5, "borderBottom": "0.438px solid rgba(0, 0, 0, 0.1)"} },
    { k: 'box', s: {"left": 14.44, "top": 92.3, "width": 606.38, "height": 17.5, "borderBottom": "0.438px solid rgba(17, 24, 39, 0.06)"} },
    { k: 'box', s: {"left": 14.44, "top": 140.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 125.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 127.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 127.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 123.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 158.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 143.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 144.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 144.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 141.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 306.69, "top": 146.99, "width": 6.12, "height": 6.12, "backgroundColor": "rgb(66, 45, 127)", "borderRadius": "4374.56px"} },
    { k: 'box', s: {"left": 14.44, "top": 175.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 160.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 162.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 162.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 158.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 193.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 178.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 179.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 179.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 176.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 210.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 195.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 197.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 197.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 193.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 193.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 193.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 193.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 193.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 448.83, "top": 198.62, "width": 16.71, "height": 7.88, "backgroundColor": "rgb(238, 239, 240)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 14.44, "top": 228.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 213.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 214.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 214.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 211.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 245.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 230.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 232.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 232.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 228.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 228.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 228.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 228.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 228.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 448.83, "top": 233.62, "width": 16.71, "height": 7.88, "backgroundColor": "rgb(238, 239, 240)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 469.83, "top": 233.62, "width": 16.71, "height": 7.88, "backgroundColor": "rgb(238, 239, 240)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 14.44, "top": 263.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 248.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 249.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 249.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 246.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 448.83, "top": 251.12, "width": 16.71, "height": 7.88, "backgroundColor": "rgb(238, 239, 240)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 14.44, "top": 280.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 265.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 267.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 267.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 263.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 298.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 283.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 284.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 284.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 281.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 315.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 300.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 302.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 302.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 298.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 333.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 318.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 319.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 319.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 316.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 306.69, "top": 321.99, "width": 6.12, "height": 6.12, "backgroundColor": "rgb(66, 45, 127)", "borderRadius": "4374.56px"} },
    { k: 'box', s: {"left": 373.19, "top": 316.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 316.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 316.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 316.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 448.83, "top": 321.12, "width": 16.71, "height": 7.88, "backgroundColor": "rgb(238, 239, 240)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 14.44, "top": 364.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 349.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 351.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 351.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 347.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 347.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 347.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 347.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 347.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 382.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 367.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 368.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 368.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 365.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 399.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 384.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 386.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 386.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 382.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 382.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 382.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 382.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 382.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 448.83, "top": 387.62, "width": 16.71, "height": 7.88, "backgroundColor": "rgb(238, 239, 240)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 14.44, "top": 417.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 402.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 403.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 403.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 400.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 400.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 400.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 400.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 400.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 448.83, "top": 405.12, "width": 16.71, "height": 7.88, "backgroundColor": "rgb(238, 239, 240)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 14.44, "top": 434.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 419.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 421.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 421.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 417.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 452.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 437.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 438.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 438.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 435.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 435.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 435.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 435.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 435.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 469.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 454.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 456.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 456.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 452.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 487.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 472.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 473.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 473.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 470.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 470.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 470.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 470.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 470.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 518.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 503.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 505.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 505.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 501.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 501.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 501.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 501.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 501.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 448.83, "top": 506.62, "width": 16.71, "height": 7.88, "backgroundColor": "rgb(238, 239, 240)", "border": "0.438px solid rgba(0, 0, 0, 0)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 14.44, "top": 536.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 521.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 522.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 522.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 519.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 553.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 538.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 540.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 540.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 536.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 536.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 536.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 536.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 536.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 571.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 556.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 557.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(154, 220, 255)", "border": "0.438px solid rgb(154, 220, 255)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 557.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 554.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 554.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 554.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 554.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 554.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 588.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 573.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 575.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 575.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 571.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 571.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 571.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 571.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 571.8, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 606.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 591.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 592.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 592.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 589.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 623.87, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 608.55, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(53, 226, 147)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 610.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(53, 226, 147)", "border": "0.438px solid rgb(0, 81, 50)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 610.3, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 606.8, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 14.44, "top": 641.37, "width": 606.38, "height": 0.44, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": 23.19, "top": 626.05, "width": 14.0, "height": 14.0, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "3.5px"} },
    { k: 'box', s: {"left": 163.19, "top": 627.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 233.19, "top": 627.8, "width": 19.25, "height": 10.5, "backgroundColor": "rgb(255, 255, 255)", "border": "0.438px solid rgb(144, 154, 172)", "borderRadius": "1.75px"} },
    { k: 'box', s: {"left": 303.19, "top": 624.3, "width": 70.0, "height": 17.5, "backgroundColor": "rgb(248, 240, 255)"} },
    { k: 'box', s: {"left": 373.19, "top": 624.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 390.69, "top": 624.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 408.19, "top": 624.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'box', s: {"left": 425.69, "top": 624.3, "width": 17.5, "height": 17.5, "backgroundColor": "rgb(225, 206, 255)"} },
    { k: 'text', s: {"left": 23.19, "top": 71.96, "fontSize": 8.75, "lineHeight": "8.75px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "Granskning" },
    { k: 'text', s: {"left": 163.19, "top": 69.12, "fontSize": 8.75, "lineHeight": "8.75px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "59%" },
    { k: 'text', s: {"left": 163.19, "top": 82.24, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Redo för review" },
    { k: 'text', s: {"left": 233.19, "top": 69.12, "fontSize": 8.75, "lineHeight": "8.75px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0%" },
    { k: 'text', s: {"left": 233.19, "top": 82.24, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Kvalitetssäkrad" },
    { k: 'text', s: {"left": 23.19, "top": 98.21, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "Balansräkning" },
    { k: 'text', s: {"left": 14.44, "top": 115.05, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Tillgångar" },
    { k: 'text', s: {"left": 26.29, "top": 129.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 129.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "10. Immateriella anläggningstillgångar" },
    { k: 'text', s: {"left": 168.36, "top": 129.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 129.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 129.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 129.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 129.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 129.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 362.17, "top": 129.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "–" },
    { k: 'text', s: {"left": 26.29, "top": 146.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 147.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "11. Byggnader och mark" },
    { k: 'text', s: {"left": 168.36, "top": 146.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 146.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 146.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 146.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 146.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 146.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 339.05, "top": 146.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "1 091 938" },
    { k: 'text', s: {"left": 26.29, "top": 164.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 164.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "12. Maskiner och inventarier" },
    { k: 'text', s: {"left": 168.36, "top": 164.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 164.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 164.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 164.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 164.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 164.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 344.01, "top": 164.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "153 911" },
    { k: 'text', s: {"left": 26.29, "top": 181.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 182.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "13. Finansiella anläggningstillgångar" },
    { k: 'text', s: {"left": 168.36, "top": 181.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 181.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 181.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 181.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 181.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 181.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 347.45, "top": 181.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "16 000" },
    { k: 'text', s: {"left": 42.44, "top": 199.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "14A. Lager" },
    { k: 'text', s: {"left": 168.36, "top": 199.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 171.79, "top": 199.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 199.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "6" },
    { k: 'text', s: {"left": 238.36, "top": 199.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 199.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 199.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "6" },
    { k: 'text', s: {"left": 344.01, "top": 199.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "681 148" },
    { k: 'text', s: {"left": 380.49, "top": 199.22, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 199.22, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 199.22, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 199.22, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 458.45, "top": 199.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)"}, t: "1" },
    { k: 'text', s: {"left": 26.29, "top": 216.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 217.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "14B. Pågående arbete" },
    { k: 'text', s: {"left": 168.36, "top": 216.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 216.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 216.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 216.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 216.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 216.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 350.9, "top": 216.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "4 125" },
    { k: 'text', s: {"left": 42.44, "top": 234.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "15. Kundfordringar" },
    { k: 'text', s: {"left": 168.36, "top": 234.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 171.79, "top": 234.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 234.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "5" },
    { k: 'text', s: {"left": 238.36, "top": 234.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 234.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 234.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "5" },
    { k: 'text', s: {"left": 344.01, "top": 234.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "444 620" },
    { k: 'text', s: {"left": 380.49, "top": 234.22, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 234.22, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 234.22, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 234.22, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 458.45, "top": 234.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)"}, t: "2" },
    { k: 'text', s: {"left": 479.45, "top": 234.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)"}, t: "2" },
    { k: 'text', s: {"left": 26.29, "top": 251.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 252.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "16A. Övriga kortfristiga fordringar" },
    { k: 'text', s: {"left": 168.36, "top": 251.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 251.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 251.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 251.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 251.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 251.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 347.45, "top": 251.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "55 351" },
    { k: 'text', s: {"left": 458.45, "top": 252.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)"}, t: "1" },
    { k: 'text', s: {"left": 42.44, "top": 269.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "16B. Upparbetat/Fakturerat" },
    { k: 'text', s: {"left": 168.36, "top": 269.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 171.79, "top": 269.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 269.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 269.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 269.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 269.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 362.17, "top": 269.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "–" },
    { k: 'text', s: {"left": 26.29, "top": 286.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 287.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "17. Förutbetalda kostnader och upplupna intäkter" },
    { k: 'text', s: {"left": 168.36, "top": 286.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 286.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 286.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 286.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 286.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 286.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 347.45, "top": 286.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "48 000" },
    { k: 'text', s: {"left": 26.29, "top": 304.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 304.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "18. Kortfristiga placeringar" },
    { k: 'text', s: {"left": 168.36, "top": 304.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 304.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 304.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 304.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 304.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 304.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 350.9, "top": 304.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "2 400" },
    { k: 'text', s: {"left": 26.29, "top": 321.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 322.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "19. Kassa och bank" },
    { k: 'text', s: {"left": 168.36, "top": 321.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "2" },
    { k: 'text', s: {"left": 171.79, "top": 321.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 321.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "2" },
    { k: 'text', s: {"left": 238.36, "top": 321.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 321.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 321.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "2" },
    { k: 'text', s: {"left": 344.01, "top": 321.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "795 373" },
    { k: 'text', s: {"left": 380.49, "top": 321.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 321.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 321.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 321.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 458.45, "top": 322.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)"}, t: "1" },
    { k: 'text', s: {"left": 14.44, "top": 339.05, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Eget kapital och skulder" },
    { k: 'text', s: {"left": 26.29, "top": 353.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 353.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "20. Eget kapital" },
    { k: 'text', s: {"left": 168.36, "top": 353.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 171.79, "top": 353.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 353.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 238.36, "top": 353.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 353.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 353.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 337.35, "top": 353.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-1 184 604" },
    { k: 'text', s: {"left": 380.49, "top": 353.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 353.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 353.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 353.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 26.29, "top": 370.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 371.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "21. Obeskattade reserver" },
    { k: 'text', s: {"left": 168.36, "top": 370.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 370.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 370.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 370.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 370.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 370.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 342.32, "top": 370.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-115 000" },
    { k: 'text', s: {"left": 26.29, "top": 388.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 388.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "23B. Andra långfristiga skulder" },
    { k: 'text', s: {"left": 168.36, "top": 388.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "5" },
    { k: 'text', s: {"left": 171.79, "top": 388.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 388.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "5" },
    { k: 'text', s: {"left": 238.36, "top": 388.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 388.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 388.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "5" },
    { k: 'text', s: {"left": 342.32, "top": 388.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-251 006" },
    { k: 'text', s: {"left": 380.49, "top": 388.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 388.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 388.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 388.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 458.45, "top": 388.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)"}, t: "1" },
    { k: 'text', s: {"left": 26.29, "top": 405.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 406.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "24A. Leverantörsskulder" },
    { k: 'text', s: {"left": 168.36, "top": 405.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 171.79, "top": 405.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 405.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 238.36, "top": 405.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 405.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 405.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 342.32, "top": 405.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-436 743" },
    { k: 'text', s: {"left": 380.49, "top": 405.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 405.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 405.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 405.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 458.45, "top": 406.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)"}, t: "1" },
    { k: 'text', s: {"left": 26.29, "top": 423.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 423.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "25. Skatteskuld/skattefordran" },
    { k: 'text', s: {"left": 168.36, "top": 423.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 423.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 423.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 423.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 423.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 423.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 345.76, "top": 423.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-10 039" },
    { k: 'text', s: {"left": 42.44, "top": 441.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "26. Momsskuld/momsfordran" },
    { k: 'text', s: {"left": 168.36, "top": 440.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "2" },
    { k: 'text', s: {"left": 171.79, "top": 440.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 440.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 238.36, "top": 440.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 440.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 440.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 362.74, "top": 440.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "0" },
    { k: 'text', s: {"left": 380.49, "top": 440.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 440.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 440.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 440.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 26.29, "top": 458.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 458.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "27. Personalskatter" },
    { k: 'text', s: {"left": 168.36, "top": 458.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 171.79, "top": 458.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 458.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 238.36, "top": 458.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 458.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 458.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 345.76, "top": 458.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-34 369" },
    { k: 'text', s: {"left": 42.44, "top": 476.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "29. Upplupna kostnader och förutbetalda intäkter" },
    { k: 'text', s: {"left": 168.36, "top": 475.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 171.79, "top": 475.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 475.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "2" },
    { k: 'text', s: {"left": 238.36, "top": 475.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 475.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 475.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "2" },
    { k: 'text', s: {"left": 342.32, "top": 475.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-146 643" },
    { k: 'text', s: {"left": 380.49, "top": 475.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 475.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 475.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 475.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 14.44, "top": 493.05, "fontSize": 4.38, "lineHeight": "4.81px", "color": "rgba(16, 24, 41, 0.7)", "fontWeight": 600, "textTransform": "uppercase", "letterSpacing": "0.088px"}, t: "Resultaträkning" },
    { k: 'text', s: {"left": 42.44, "top": 507.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "30. Nettoomsättning" },
    { k: 'text', s: {"left": 168.36, "top": 507.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "2" },
    { k: 'text', s: {"left": 171.79, "top": 507.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 507.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "6" },
    { k: 'text', s: {"left": 238.36, "top": 507.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 507.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 507.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "6" },
    { k: 'text', s: {"left": 337.35, "top": 507.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-5 319 960" },
    { k: 'text', s: {"left": 380.49, "top": 507.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 507.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 507.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 507.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 458.45, "top": 507.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)"}, t: "1" },
    { k: 'text', s: {"left": 26.29, "top": 524.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 525.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "39. Övriga intäkter" },
    { k: 'text', s: {"left": 168.36, "top": 524.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 524.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 524.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 524.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 524.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 524.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 361.05, "top": 524.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "-4" },
    { k: 'text', s: {"left": 42.44, "top": 542.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "40. Direkta kostnader" },
    { k: 'text', s: {"left": 168.36, "top": 542.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 542.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 542.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 238.36, "top": 542.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 542.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 542.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "4" },
    { k: 'text', s: {"left": 339.05, "top": 542.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "3 497 422" },
    { k: 'text', s: {"left": 380.49, "top": 542.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 542.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 542.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 542.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 42.44, "top": 560.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "50. Övriga externa kostnader mm" },
    { k: 'text', s: {"left": 168.36, "top": 559.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "2" },
    { k: 'text', s: {"left": 171.79, "top": 559.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 559.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(10, 58, 83)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 238.36, "top": 559.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 559.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 559.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 344.01, "top": 559.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "450 413" },
    { k: 'text', s: {"left": 380.49, "top": 559.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 559.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 559.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 559.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 26.29, "top": 577.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 577.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "70. Personalkostnader" },
    { k: 'text', s: {"left": 168.36, "top": 577.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 171.79, "top": 577.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 577.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 238.36, "top": 577.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 577.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 577.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "3" },
    { k: 'text', s: {"left": 339.05, "top": 577.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "1 011 465" },
    { k: 'text', s: {"left": 380.49, "top": 577.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 577.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 577.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 577.23, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'text', s: {"left": 26.29, "top": 594.55, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 595.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "78. Avskrivningar" },
    { k: 'text', s: {"left": 168.36, "top": 594.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 594.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 594.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 594.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 594.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 594.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 347.45, "top": 594.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "48 400" },
    { k: 'text', s: {"left": 26.29, "top": 612.05, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(0, 81, 50)", "letterSpacing": "-0.031px"}, t: "UA" },
    { k: 'text', s: {"left": 42.44, "top": 612.93, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "80. Finansiella poster" },
    { k: 'text', s: {"left": 168.36, "top": 612.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 171.79, "top": 612.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 612.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(0, 81, 50)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 612.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 612.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 612.49, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 350.9, "top": 612.05, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "2 490" },
    { k: 'text', s: {"left": 42.44, "top": 630.43, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "88. Bokslutsdisp., skatt och årets resultat" },
    { k: 'text', s: {"left": 168.36, "top": 629.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 171.79, "top": 629.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 174.27, "top": 629.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 238.36, "top": 629.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "0" },
    { k: 'text', s: {"left": 241.79, "top": 629.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500, "opacity": 0.6}, t: "/" },
    { k: 'text', s: {"left": 244.27, "top": 629.99, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "1" },
    { k: 'text', s: {"left": 344.01, "top": 629.55, "fontSize": 6.12, "lineHeight": "7px", "color": "rgb(0, 0, 0)"}, t: "309 773" },
    { k: 'text', s: {"left": 380.49, "top": 629.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "F" },
    { k: 'text', s: {"left": 396.18, "top": 629.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "E/I" },
    { k: 'text', s: {"left": 411.93, "top": 629.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "V/M" },
    { k: 'text', s: {"left": 431.34, "top": 629.73, "fontSize": 5.25, "lineHeight": "6.12px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "RF" },
    { k: 'svg', s: {"left": 17.06, "top": 74.8, "width": 3.5, "height": 3.06, "color": "rgb(16, 24, 41)"}, vb: "0 0 8 7", sw: 0, stroke: true, p: [[null, "M1.1 2.3 4 5.1 6.9 2.3"]] },
    { k: 'svg', s: {"left": 17.06, "top": 99.3, "width": 3.5, "height": 3.06, "color": "rgb(16, 24, 41)"}, vb: "0 0 8 7", sw: 0, stroke: true, p: [[null, "M1.1 2.3 4 5.1 6.9 2.3"]] },
    { k: 'svg', s: {"left": 308.0, "top": 148.3, "width": 3.5, "height": 3.5, "color": "rgb(255, 255, 255)"}, vb: "0 0 1024 1024", sw: 80.0, stroke: true, p: [[null, "M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"]] },
    { k: 'svg', s: {"left": 452.76, "top": 200.37, "width": 4.38, "height": 4.38, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M880 305H624V192c0-17.7-14.3-32-32-32H184v-40c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V640h248v113c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V337c0-17.7-14.3-32-32-32zM184 568V232h368v336H184zm656 145H504v-73h112c4.4 0 8-3.6 8-8V377h216v336z"]] },
    { k: 'svg', s: {"left": 452.76, "top": 235.37, "width": 4.38, "height": 4.38, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"]] },
    { k: 'svg', s: {"left": 473.76, "top": 235.37, "width": 4.38, "height": 4.38, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 336a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"]] },
    { k: 'svg', s: {"left": 452.76, "top": 252.87, "width": 4.38, "height": 4.38, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"]] },
    { k: 'svg', s: {"left": 308.0, "top": 323.3, "width": 3.5, "height": 3.5, "color": "rgb(255, 255, 255)"}, vb: "0 0 1024 1024", sw: 80.0, stroke: true, p: [[null, "M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"]] },
    { k: 'svg', s: {"left": 452.76, "top": 322.87, "width": 4.38, "height": 4.38, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"]] },
    { k: 'svg', s: {"left": 452.76, "top": 389.37, "width": 4.38, "height": 4.38, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 336a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"]] },
    { k: 'svg', s: {"left": 452.76, "top": 406.87, "width": 4.38, "height": 4.38, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M880 305H624V192c0-17.7-14.3-32-32-32H184v-40c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V640h248v113c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V337c0-17.7-14.3-32-32-32zM184 568V232h368v336H184zm656 145H504v-73h112c4.4 0 8-3.6 8-8V377h216v336z"]] },
    { k: 'svg', s: {"left": 452.76, "top": 508.37, "width": 4.38, "height": 4.38, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M880 305H624V192c0-17.7-14.3-32-32-32H184v-40c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V640h248v113c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V337c0-17.7-14.3-32-32-32zM184 568V232h368v336H184zm656 145H504v-73h112c4.4 0 8-3.6 8-8V377h216v336z"]] },
  ],
  panel: [
    { k: 'box', s: {"left": 437.5, "top": 240.62, "width": 183.75, "height": 245.0, "backgroundColor": "rgba(255, 255, 255, 0.6)", "border": "0.438px solid rgb(255, 255, 255)", "borderRadius": "1.75px", "boxShadow": "rgba(16, 24, 41, 0.12) 0px 5.25px 14px 0px, rgba(16, 24, 41, 0.06) 0px 1.75px 3.5px 0px", "backdropFilter": "blur(7px) saturate(1.05)"} },
    { k: 'box', s: {"left": 437.94, "top": 241.06, "width": 182.88, "height": 28.0, "borderBottom": "0.438px solid rgba(16, 24, 41, 0.08)"} },
    { k: 'text', s: {"left": 464.19, "top": 251.34, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(16, 24, 41)", "fontWeight": 500}, t: "Lagstadgad revision: 2025-12" },
    { k: 'svg', s: {"left": 587.56, "top": 251.34, "width": 7.0, "height": 7.0, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z"]] },
    { k: 'svg', s: {"left": 605.5, "top": 251.78, "width": 6.12, "height": 6.12, "color": "rgb(16, 24, 41)"}, vb: "0 0 1024 1024", sw: 0.0, stroke: true, p: [[null, "M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"]] },
  ],
  q: [
    { k: 'box', s: {"left": 522.43, "top": 344.75, "width": 91.38, "height": 18.38, "backgroundColor": "rgb(238, 239, 240)", "borderRadius": "10.5px 10.5px 0px"} },
    { k: 'text', s: {"left": 529.43, "top": 350.44, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(16, 24, 41)"}, t: "Var finns risken i uppdraget?" },
  ],
  a0: [
    { k: 'text', s: {"left": 444.94, "top": 371.44, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(16, 24, 41)"}, t: "Risken är störst i 15. Kundfordringar och 14A. Lager. Båda har" },
    { k: 'text', s: {"left": 444.94, "top": 381.06, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(16, 24, 41)"}, t: "öppna granskningsåtgärder och riskmarkeringar på flera" },
    { k: 'text', s: {"left": 444.94, "top": 390.69, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(16, 24, 41)"}, t: "påståenden." },

  ],
  chip: [
    { k: 'box', s: {"left": 482.16, "top": 390.69, "width": 49.1, "height": 6.12, "backgroundColor": "rgb(238, 239, 240)", "borderRadius": "1.312px"} },
    { k: 'text', s: {"left": 483.91, "top": 391.56, "fontSize": 3.94, "lineHeight": "3.94px", "color": "rgba(16, 24, 41, 0.8)", "textTransform": "uppercase", "letterSpacing": "0.079px"}, t: "15. Kundfordringar" },
    { k: 'text', s: {"left": 524.91, "top": 391.56, "fontSize": 3.94, "lineHeight": "3.94px", "color": "rgba(16, 24, 41, 0.8)", "textTransform": "uppercase", "letterSpacing": "0.079px"}, t: " +1" },
  ],
  a1: [
    { k: 'text', s: {"left": 444.94, "top": 407.31, "fontSize": 6.12, "lineHeight": "6.56px", "color": "rgb(16, 24, 41)"}, t: "Kundfordringar har två varningar som inte är hanterade." },
  ],
  composer: [
    { k: 'box', s: {"left": 444.94, "top": 422.62, "width": 168.88, "height": 55.56, "borderTop": "0.438px solid rgba(16, 24, 41, 0.08)"} },
    { k: 'text', s: {"left": 444.94, "top": 472.06, "fontSize": 5.25, "lineHeight": "5.25px", "color": "rgba(16, 24, 41, 0.8)"}, t: "Ally kan göra fel. Gör alltid en egen bedömning." },
    { k: 'svg', s: {"left": 597.62, "top": 451.5, "width": 7.0, "height": 7.0, "color": "rgb(255, 255, 255)", "opacity": 0.25}, vb: "0 0 1024 1024", sw: 16.0, stroke: true, p: [[null, "M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"]] },
  ],
};

/* The close-up: the same page corner at 2.625 canvas px per page px (6× the world), already offset into frame. */
const MACRO: Record<string, El[]> = {
  page: [
    { k: 'box', s: {"left": -3214.75, "top": -2456.12, "width": 4158.0, "height": 2955.75, "backgroundImage": "radial-gradient(300% 200% at 130% 90%, rgb(206, 178, 244) 0%, rgb(242, 242, 243) 50%)"} },
    { k: 'box', s: {"left": 554.75, "top": -2156.93, "width": 367.5, "height": 2635.55, "backgroundColor": "rgba(255, 255, 255, 0.6)", "border": "2.625px solid rgb(255, 255, 255)", "borderRadius": "10.5px", "backdropFilter": "blur(15.75px)"} },
  ],
  tablepanel: [
    { k: 'box', s: {"left": -3193.75, "top": -2156.93, "width": 3727.5, "height": 2635.55, "backgroundColor": "rgba(255, 255, 255, 0.6)", "border": "2.625px solid rgb(255, 255, 255)", "borderRadius": "10.5px"} },
  ],
  table: [
    { k: 'box', s: {"left": -3149.12, "top": 27.07, "width": 3638.25, "height": 2.62, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": -3149.12, "top": 132.07, "width": 3638.25, "height": 2.62, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": -3149.12, "top": 237.07, "width": 3638.25, "height": 2.62, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": -3149.12, "top": 342.07, "width": 3638.25, "height": 2.62, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
    { k: 'box', s: {"left": -3149.12, "top": 447.07, "width": 3638.25, "height": 2.62, "backgroundColor": "rgba(16, 24, 41, 0.08)"} },
  ],
};

/* Ally — paths from AllyPrata.svg (328×399). [fill, d] */
const ALLY_PATHS: [string, string][] = [
  ['#CDDFE7', 'M163.647 0.00276065C164.562 0.00560904 165.477 0.00391133 166.392 0.00104141C172.101 -0.0141442 177.813 0.128111 183.464 1.02107C183.74 1.06347 184.016 1.10587 184.3 1.14955C190.666 2.16692 197.069 3.80247 202.245 7.81795C202.395 7.92333 202.544 8.02871 202.697 8.13728C205.381 10.176 207.052 13.5349 208.147 16.6304C208.204 16.7929 208.262 16.9553 208.322 17.1226C208.463 17.521 208.604 17.9194 208.745 18.3179C209.214 18.3798 209.214 18.3798 209.691 18.4429C231.079 21.2894 258.364 25.2583 276.245 44.0679C281.853 51.4017 285.353 60.1618 285.261 69.4898C285.259 69.7898 285.256 70.0899 285.254 70.399C285.251 70.6198 285.248 70.8405 285.245 71.0679C285.416 71.0744 285.587 71.0808 285.763 71.0875C289.927 71.3218 293.956 72.047 297.745 73.8179C297.933 73.8969 298.12 73.9759 298.313 74.0572C303.231 76.2509 306.823 80.9209 308.8 85.8052C310.175 89.4107 310.143 93.0558 310.128 96.858C310.129 97.4589 310.13 98.0598 310.131 98.6607C310.133 99.9132 310.13 101.166 310.126 102.418C310.12 104.013 310.123 105.608 310.129 107.203C310.133 108.442 310.132 109.68 310.129 110.919C310.129 111.507 310.129 112.094 310.132 112.682C310.153 119.386 308.707 124.888 304.245 130.068C304.032 130.322 304.032 130.322 303.814 130.582C299.515 135.297 292.836 136.916 286.745 137.568C286.245 137.579 285.745 137.585 285.245 137.568C285.242 137.823 285.238 138.078 285.235 138.341C284.978 147.692 281.319 158.056 274.45 164.619C273.999 165.064 273.598 165.53 273.198 166.021C267.754 172.284 259.515 175.578 251.995 178.568C251.731 178.673 251.466 178.779 251.193 178.887C239.094 183.628 226.063 186.089 213.245 187.927C213.017 187.96 212.788 187.993 212.553 188.027C211.904 188.12 211.254 188.211 210.605 188.301C210.413 188.329 210.221 188.356 210.024 188.384C209.006 188.522 208.022 188.596 206.995 188.568C207.078 189.475 207.16 190.383 207.245 191.318C207.46 191.374 207.674 191.431 207.896 191.489C219.042 194.433 229.913 198.174 239.745 204.318C239.908 204.42 240.071 204.521 240.238 204.626C243.164 206.476 246.04 208.527 248.619 210.839C248.753 210.958 248.886 211.076 249.023 211.197C249.376 211.514 249.722 211.836 250.068 212.16C250.82 212.613 251.114 212.595 251.952 212.414C255.573 211.772 259.7 212.162 263.245 213.068C263.542 213.135 263.838 213.201 264.144 213.27C271.719 215.091 278.713 219.281 284.304 224.655C284.886 225.213 285.477 225.747 286.089 226.271C287.516 227.509 288.799 228.852 290.03 230.284C290.347 230.648 290.671 231.006 291 231.36C292.602 233.083 293.996 234.937 295.385 236.831C295.618 237.146 295.853 237.459 296.091 237.769C297.297 239.343 298.391 240.99 299.48 242.646C299.583 242.803 299.686 242.96 299.793 243.122C302.571 247.361 305.055 251.774 307.265 256.336C307.609 257.047 307.968 257.749 308.335 258.448C319.019 278.972 328.27 305.648 327.995 342.568C327.944 342.752 327.892 342.937 327.839 343.127C325.74 350.435 321.459 356.246 314.812 359.949C309.635 362.537 303.188 362.555 297.745 360.818C296.708 360.463 295.729 360.051 294.745 359.568C294.341 359.371 294.341 359.371 293.928 359.169C292.103 358.235 290.537 357.166 288.995 355.818C288.766 355.622 288.536 355.425 288.3 355.223C284.501 351.889 281.831 347.633 279.745 343.068C279.662 342.888 279.579 342.707 279.494 342.521C275.879 334.584 274.43 325.931 272.818 317.418C272.614 316.343 272.409 315.269 272.203 314.194C272.162 313.978 272.121 313.763 272.079 313.541C271.995 313.106 271.912 312.67 271.829 312.235C271.705 311.585 271.581 310.936 271.457 310.286C270.724 306.451 269.982 302.618 269.23 298.787C269.146 298.359 269.146 298.359 269.06 297.923C268.249 293.795 267.414 289.674 266.495 285.568C266.46 285.788 266.425 286.008 266.389 286.235C264.597 297.444 262.452 308.531 258.904 319.333C258.74 319.835 258.577 320.337 258.414 320.84C254.817 331.888 250.207 342.479 243.995 352.318C243.85 352.55 243.705 352.782 243.556 353.021C242.631 354.492 241.663 355.917 240.636 357.318C240.35 357.71 240.065 358.101 239.78 358.493C239.644 358.678 239.508 358.864 239.369 359.055C239.055 359.486 238.746 359.919 238.438 360.354C237.259 362.014 235.974 363.553 234.645 365.093C234.346 365.448 234.054 365.809 233.765 366.173C232.27 368.05 230.64 369.732 228.933 371.412C228.665 371.678 228.396 371.943 228.128 372.21C227.637 372.697 227.145 373.183 226.652 373.669C226.212 374.104 225.773 374.541 225.337 374.981C210.925 389.293 189.886 397.96 168.495 398.818C168.223 398.823 167.951 398.828 167.671 398.833C157.592 398.994 147.354 398.036 137.745 394.818C137.458 394.723 137.171 394.627 136.875 394.529C127.919 391.511 119.614 387.176 111.995 381.568C111.763 381.398 111.763 381.398 111.526 381.225C108.681 379.129 105.921 376.838 103.468 374.29C103.015 373.837 102.546 373.423 102.057 373.009C101.009 372.099 100.061 371.119 99.1204 370.099C98.9569 369.923 98.7935 369.747 98.6252 369.566C98.1638 369.068 97.7042 368.568 97.2454 368.068C97.042 367.846 96.8387 367.624 96.6291 367.396C95.4436 366.081 94.3335 364.714 93.2454 363.318C93.1264 363.166 93.0074 363.014 92.8848 362.857C88.6969 357.488 84.9681 351.82 81.7454 345.818C81.6188 345.583 81.4923 345.348 81.3619 345.106C71.8178 327.285 66.5406 307.98 63.4894 288.078C63.358 287.229 63.2124 286.398 62.9953 285.568C61.6082 292.093 60.2741 298.627 59.011 305.177C58.9484 305.501 58.8859 305.825 58.8214 306.159C58.1894 309.433 57.5623 312.708 56.9445 315.985C51.8275 343.112 51.8275 343.112 43.9953 352.318C43.8175 352.532 43.6396 352.746 43.4563 352.966C39.1793 357.91 33.0928 361.375 26.5068 361.874C19.7578 362.127 14.3802 360.698 9.24828 356.157C2.87855 350.226 0.453132 341.485 0.0422268 333.037C-0.740589 310.385 9.46232 284.676 22.1919 256.404C22.5597 255.694 22.9096 254.976 23.2587 254.256C26.5153 247.584 30.6232 241.129 35.2453 235.318C35.4473 235.062 35.4473 235.062 35.6533 234.8C37.0441 233.038 38.4279 231.301 40.0549 229.749C40.5268 229.287 40.9558 228.803 41.386 228.302C42.7985 226.666 44.3467 225.213 45.9953 223.818C46.1984 223.646 46.4014 223.473 46.6106 223.295C49.6316 220.775 52.772 218.661 56.2453 216.818C56.5054 216.679 56.7655 216.54 57.0334 216.397C62.3034 213.674 67.7043 212.267 73.636 212.287C74.0834 212.285 74.0834 212.285 74.5398 212.284C76.9685 212.286 76.9685 212.286 77.9817 212.525C78.7947 212.647 78.7947 212.647 79.5237 212.05C79.7942 211.8 80.0606 211.545 80.3235 211.287C80.6284 211.007 80.9348 210.729 81.2424 210.452C81.4041 210.306 81.5657 210.16 81.7323 210.01C92.9954 200.296 107.991 194.793 122.245 191.318C122.328 190.575 122.41 189.833 122.495 189.068C122.184 189.041 121.872 189.014 121.551 188.986C118.163 188.683 114.799 188.27 111.433 187.787C111.17 187.749 110.907 187.711 110.635 187.673C95.2376 185.455 79.8971 181.922 65.7454 175.318C65.5172 175.212 65.2889 175.107 65.0538 174.998C60.5128 172.876 56.6774 170.211 52.9953 166.818C52.6521 166.502 52.6521 166.502 52.302 166.179C45.5538 159.687 40.5656 149.774 40.2453 140.318C40.2296 139.234 40.2301 138.152 40.2453 137.068C40.0095 137.043 39.7736 137.019 39.5305 136.994C33.7864 136.325 28.3221 133.745 24.4954 129.318C21.3096 125.242 19.4653 120.628 19.4511 115.441C19.4495 115.179 19.4478 114.917 19.4461 114.648C19.4412 113.784 19.4383 112.919 19.4358 112.055C19.4348 111.759 19.4337 111.462 19.4327 111.156C19.4275 109.584 19.4239 108.011 19.4216 106.439C19.4188 104.825 19.4102 103.21 19.4003 101.596C19.3937 100.347 19.3916 99.0972 19.3907 97.8478C19.3895 97.2533 19.3867 96.6588 19.382 96.0643C19.3514 91.9125 19.5033 87.9182 21.4016 84.1304C21.4862 83.9567 21.5708 83.783 21.658 83.6041C24.4488 78.1021 29.1482 74.5124 34.8838 72.5135C36.6254 71.9566 38.4125 71.5679 40.2453 71.5679C40.2366 71.2441 40.2279 70.9202 40.219 70.5865C40.0196 59.9116 43.9293 49.5079 51.3274 41.7594C51.658 41.4171 51.658 41.4171 51.9953 41.0679C52.1952 40.8553 52.395 40.6426 52.6008 40.4234C55.1494 37.7749 58.0525 35.63 61.2453 33.8179C61.3981 33.7311 61.5509 33.6442 61.7084 33.5548C79.4623 23.5634 101.183 19.7785 121.245 17.8179C121.294 17.4834 121.294 17.4834 121.344 17.1422C122.119 12.922 125.108 9.26631 128.495 6.81795C138.493 0.193213 152.056 -0.0336782 163.647 0.00276065Z'],
  ['#062138', 'M162.737 45.2716C163.869 45.2716 165.002 45.2699 166.135 45.2665C176.121 45.2368 186.088 45.4502 196.042 46.2867C196.304 46.308 196.565 46.3293 196.834 46.3513C218.114 48.0873 243.542 50.5979 264.495 64.818C264.625 64.9236 264.754 65.0293 264.887 65.1381C265.978 66.0322 266.861 66.9728 267.745 68.068C267.849 68.1963 267.953 68.3246 268.059 68.4567C270.894 72.0139 272.726 75.8837 273.745 80.318C273.789 80.5048 273.832 80.6917 273.877 80.8843C274.4 83.522 274.32 86.1808 274.318 88.8575C274.32 89.4163 274.321 89.9752 274.323 90.534C274.328 92.0455 274.329 93.5569 274.329 95.0684C274.329 96.0151 274.331 96.9617 274.332 97.9084C274.336 101.047 274.339 104.186 274.338 107.325C274.338 107.578 274.338 107.578 274.338 107.836C274.338 108.005 274.338 108.174 274.338 108.348C274.338 111.082 274.343 113.815 274.35 116.548C274.357 119.366 274.36 122.183 274.36 125C274.36 126.578 274.361 128.155 274.367 129.732C274.371 131.218 274.371 132.704 274.368 134.189C274.367 134.731 274.368 135.272 274.371 135.813C274.412 143.494 272.515 150.368 267.495 156.318C267.363 156.483 267.231 156.649 267.095 156.819C253.842 172.867 221.727 175.336 200.909 177.436C189.41 178.523 177.869 178.908 166.323 178.883C165.009 178.88 163.694 178.882 162.379 178.885C140.2 178.926 117.651 177.498 65.9955 160.068C65.6107 159.781 65.2253 159.494 64.8392 159.209C63.7414 158.353 62.8668 157.399 61.9955 156.318C61.8576 156.155 61.7196 155.991 61.5775 155.823C57.5729 150.927 55.2073 144.8 55.2087 138.458C55.2078 138.225 55.2069 137.993 55.2059 137.753C55.2032 136.975 55.2022 136.198 55.2012 135.42C55.1997 134.862 55.198 134.303 55.1963 133.744C55.191 131.911 55.1884 130.078 55.1859 128.245C55.1849 127.612 55.1839 126.979 55.1828 126.346C55.1786 123.711 55.175 121.077 55.1731 118.442C55.1727 117.759 55.1722 117.077 55.1717 116.394C55.1716 116.224 55.1715 116.055 55.1713 115.88C55.1693 113.138 55.1629 110.397 55.1548 107.655C55.1465 104.832 55.1421 102.009 55.1412 99.1866C55.1406 97.605 55.1384 96.0235 55.1321 94.4419C55.1263 92.9511 55.1253 91.4604 55.1278 89.9696C55.1279 89.4262 55.1264 88.8829 55.1229 88.3395C55.0771 80.7159 56.8877 74.0747 61.7455 68.068C61.9076 67.8672 62.0697 67.6664 62.2367 67.4596C76.1648 51.025 108.266 48.6167 133.297 46.2789C136.908 45.9858 140.522 45.7518 144.141 45.5947C144.562 45.5761 144.982 45.5564 145.402 45.5359C151.178 45.2573 156.956 45.2711 162.737 45.2716Z'],
  ['#AFC7D2', 'M65.9955 300.818C66.2223 300.894 66.4491 300.971 66.6828 301.05C83.8332 306.826 101.119 311.839 118.995 314.818C118.995 318.778 118.995 322.738 118.995 326.818C119.738 326.9 120.48 326.983 121.245 327.068C121.996 327.184 122.745 327.304 123.494 327.431C123.932 327.504 124.37 327.576 124.809 327.649C125.038 327.687 125.266 327.724 125.502 327.763C131.139 328.69 136.786 329.417 142.467 330.012C142.93 330.061 143.393 330.111 143.855 330.16C145.484 330.333 147.112 330.464 148.745 330.568C148.911 330.579 149.076 330.589 149.247 330.6C169.037 331.868 189.084 330.811 208.564 326.984C209.495 326.818 209.495 326.818 210.495 326.818C210.495 322.858 210.495 318.898 210.495 314.818C212.274 314.493 214.053 314.168 215.886 313.834C232.146 310.808 247.826 306.056 263.495 300.818C263.392 303.215 262.838 305.475 262.245 307.787C262.17 308.083 262.17 308.083 262.094 308.385C261.115 312.242 259.991 316.038 258.745 319.818C258.635 320.157 258.525 320.496 258.415 320.836C254.817 331.885 250.208 342.478 243.995 352.318C243.851 352.55 243.706 352.782 243.556 353.021C242.632 354.492 241.663 355.917 240.636 357.318C240.351 357.71 240.065 358.101 239.78 358.493C239.644 358.678 239.509 358.864 239.369 359.055C239.055 359.486 238.746 359.919 238.438 360.354C237.259 362.014 235.974 363.553 234.645 365.093C234.346 365.448 234.054 365.809 233.765 366.173C232.27 368.05 230.64 369.732 228.933 371.412C228.665 371.678 228.396 371.943 228.128 372.21C227.637 372.697 227.145 373.183 226.652 373.669C226.212 374.104 225.773 374.541 225.337 374.981C210.925 389.293 189.887 397.96 168.495 398.818C168.223 398.823 167.951 398.828 167.671 398.833C157.592 398.994 147.354 398.036 137.745 394.818C137.458 394.723 137.171 394.627 136.875 394.529C127.919 391.511 119.614 387.176 111.995 381.568C111.841 381.455 111.686 381.341 111.526 381.225C108.681 379.129 105.921 376.838 103.468 374.29C103.015 373.837 102.546 373.423 102.057 373.009C101.009 372.099 100.061 371.119 99.1205 370.099C98.9571 369.923 98.7937 369.747 98.6253 369.566C98.164 369.068 97.7043 368.568 97.2455 368.068C97.0421 367.846 96.8388 367.624 96.6293 367.396C95.4437 366.081 94.3336 364.714 93.2455 363.318C93.1265 363.166 93.0075 363.014 92.8849 362.857C88.6971 357.488 84.9682 351.82 81.7455 345.818C81.5557 345.465 81.5557 345.465 81.3621 345.106C74.4664 332.23 69.6195 318.422 66.3705 304.193C66.3104 303.933 66.3104 303.933 66.249 303.668C66.038 302.699 65.9823 301.806 65.9955 300.818Z'],
  ['#B7CDD7', 'M73.6516 212.271C73.952 212.268 74.2523 212.265 74.5618 212.262C74.9978 212.261 74.9978 212.261 75.4426 212.26C75.7048 212.259 75.967 212.258 76.2372 212.257C77.0567 212.323 77.7285 212.529 78.4954 212.818C77.7488 213.71 77.0045 214.573 76.1672 215.38C75.0071 216.525 74.0077 217.793 72.9954 219.068C72.6971 219.435 72.6971 219.435 72.3928 219.809C70.6322 222.022 69.1634 224.374 67.7454 226.818C67.6519 226.977 67.5584 227.136 67.462 227.3C65.3639 230.903 63.95 234.787 62.9172 238.818C62.8309 239.15 62.8309 239.15 62.7428 239.49C61.615 244.15 61.3866 248.735 61.425 253.516C61.4328 254.484 61.4353 255.452 61.4368 256.421C61.4561 262.913 61.7644 269.325 62.386 275.787C62.4744 276.711 62.5623 277.635 62.6484 278.559C62.7013 279.126 62.7555 279.693 62.8112 280.26C63.0563 282.883 63.1427 285.363 62.5539 287.941C62.483 288.27 62.483 288.27 62.4107 288.607C62.3079 289.083 62.2039 289.559 62.0987 290.035C61.8054 291.364 61.5234 292.696 61.2405 294.028C61.1799 294.312 61.1193 294.596 61.0569 294.889C60.3315 298.31 59.6711 301.743 59.011 305.177C58.9161 305.669 58.8212 306.161 58.7263 306.653C58.1263 309.762 57.5313 312.873 56.9445 315.985C51.8275 343.112 51.8275 343.112 43.9953 352.318C43.8175 352.532 43.6396 352.746 43.4563 352.966C39.1793 357.91 33.0928 361.375 26.5068 361.874C19.7578 362.127 14.3802 360.698 9.24828 356.157C2.87855 350.226 0.453132 341.485 0.0422268 333.037C-0.740589 310.385 9.46232 284.676 22.1919 256.404C22.5597 255.694 22.9096 254.976 23.2587 254.256C26.5153 247.584 30.6232 241.129 35.2453 235.318C35.38 235.147 35.5146 234.976 35.6533 234.8C37.0441 233.038 38.4279 231.301 40.0549 229.749C40.5268 229.287 40.9558 228.803 41.386 228.302C42.7985 226.666 44.3467 225.213 45.9953 223.818C46.1984 223.646 46.4014 223.473 46.6106 223.295C49.6316 220.775 52.772 218.661 56.2453 216.818C56.5054 216.679 56.7655 216.54 57.0334 216.397C62.3089 213.671 67.715 212.274 73.6516 212.271Z'],
  ['#C5D8E2', 'M255.714 212.24C256.168 212.241 256.168 212.241 256.631 212.243C258.932 212.272 261.016 212.498 263.245 213.068C263.542 213.135 263.838 213.201 264.144 213.27C271.718 215.091 278.712 219.281 284.304 224.655C284.886 225.213 285.477 225.747 286.089 226.271C287.516 227.509 288.799 228.852 290.029 230.284C290.347 230.648 290.671 231.006 291 231.36C292.602 233.083 293.995 234.937 295.385 236.831C295.618 237.146 295.853 237.459 296.091 237.769C297.296 239.343 298.391 240.99 299.479 242.646C299.583 242.803 299.686 242.96 299.793 243.122C302.571 247.361 305.055 251.774 307.265 256.337C307.609 257.047 307.968 257.749 308.335 258.448C319.019 278.972 328.27 305.648 327.995 342.568C327.944 342.752 327.892 342.937 327.839 343.127C325.74 350.435 321.458 356.246 314.812 359.949C309.635 362.537 303.187 362.555 297.745 360.818C296.708 360.463 295.729 360.051 294.745 359.568C294.475 359.436 294.206 359.305 293.928 359.17C292.102 358.235 290.536 357.166 288.995 355.818C288.651 355.524 288.651 355.524 288.3 355.223C284.501 351.889 281.831 347.633 279.745 343.068C279.662 342.888 279.579 342.707 279.493 342.521C275.878 334.584 274.43 325.931 272.818 317.418C272.614 316.343 272.409 315.269 272.203 314.194C272.162 313.979 272.121 313.763 272.078 313.541C271.995 313.106 271.912 312.67 271.829 312.235C271.704 311.585 271.58 310.936 271.456 310.286C270.724 306.451 269.981 302.618 269.229 298.787C269.174 298.501 269.118 298.215 269.06 297.92C268.559 295.363 268.058 292.806 267.493 290.261C267.456 290.093 267.419 289.926 267.381 289.753C267.222 289.036 267.059 288.32 266.888 287.606C266.262 284.87 266.491 282.178 266.76 279.406C266.787 279.112 266.814 278.819 266.842 278.517C266.928 277.586 267.016 276.655 267.104 275.724C267.726 269.171 268.046 262.687 268.055 256.106C268.056 255.403 268.06 254.7 268.065 253.998C268.098 249.886 268.029 245.87 267.245 241.818C267.192 241.533 267.138 241.248 267.083 240.954C266.941 240.257 266.781 239.57 266.604 238.88C266.542 238.635 266.479 238.389 266.415 238.136C264.019 229.197 259.144 221.891 252.999 215.127C252.316 214.369 251.655 213.596 250.995 212.818C252.592 212.222 254.027 212.232 255.714 212.24Z'],
  ['#A9C1CC', 'M206.995 188.568C207.021 190.275 207.038 191.982 207.05 193.689C207.055 194.268 207.062 194.847 207.071 195.426C207.131 199.509 207.173 203.519 204.98 207.13C204.835 207.377 204.835 207.377 204.687 207.628C199.798 215.622 189.783 219.645 181.089 221.755C165.309 225.397 146.962 224.197 132.971 215.491C129.333 213.119 126.179 210.246 124.167 206.365C124.086 206.211 124.004 206.057 123.92 205.899C122.326 202.662 122.391 199.341 122.425 195.816C122.433 194.997 122.435 194.177 122.437 193.358C122.439 192.838 122.442 192.318 122.445 191.798C122.446 191.553 122.447 191.307 122.448 191.054C122.45 190.83 122.453 190.605 122.455 190.373C122.457 190.175 122.458 189.977 122.46 189.772C122.495 189.318 122.495 189.318 122.745 189.068C123.103 189.072 123.46 189.096 123.816 189.127C124.177 189.156 124.177 189.156 124.545 189.186C124.817 189.209 125.09 189.232 125.37 189.255C128.529 189.505 131.69 189.715 134.853 189.909C135.376 189.942 135.899 189.974 136.422 190.007C142.483 190.387 148.527 190.608 154.6 190.61C155.219 190.611 155.838 190.612 156.458 190.612C157.749 190.614 159.041 190.614 160.332 190.614C161.629 190.614 162.927 190.616 164.224 190.619C174.44 190.646 184.628 190.485 194.813 189.63C195.585 189.566 196.357 189.504 197.129 189.443C199.628 189.242 202.121 189.018 204.61 188.72C205.415 188.625 206.182 188.568 206.995 188.568Z'],
  ['#EDF4F8', 'M113.574 211.021C116.077 213.07 117.735 216.023 118.067 219.268C118.096 219.994 118.098 220.716 118.089 221.443C118.092 221.685 118.095 221.927 118.098 222.176C118.082 226.242 116.057 229.357 113.335 232.248C112.284 233.264 111.138 234.157 109.996 235.068C105.09 239.039 100.322 243.601 96.7455 248.818C96.6064 249.016 96.4673 249.214 96.3239 249.418C90.856 257.22 87.1391 265.68 85.0495 274.973C84.4769 277.424 83.6409 280.111 81.5268 281.662C80.3892 281.996 79.5334 281.956 78.4643 281.443C75.4352 278.809 75.1442 274.046 74.4955 270.318C74.4138 269.875 74.4138 269.875 74.3305 269.422C71.8908 254.766 76.1012 239.096 84.6239 227.107C86.2425 224.86 88.0018 222.784 89.8862 220.755C90.0395 220.59 90.1928 220.424 90.3508 220.254C91.4224 219.116 92.5542 218.079 93.7455 217.068C93.9888 216.857 94.2322 216.646 94.4828 216.429C99.6345 212.064 106.871 206.295 113.574 211.021Z'],
  ['#BCD0DA', 'M285.245 71.0679C289.67 71.4083 293.717 71.9352 297.745 73.8179C298.026 73.9364 298.026 73.9364 298.312 74.0572C303.231 76.2509 306.823 80.9209 308.8 85.8052C310.174 89.4107 310.143 93.0557 310.128 96.858C310.129 97.4589 310.13 98.0598 310.131 98.6607C310.132 99.9132 310.13 101.166 310.125 102.418C310.12 104.013 310.123 105.608 310.129 107.203C310.133 108.442 310.132 109.68 310.129 110.919C310.128 111.507 310.129 112.094 310.131 112.682C310.152 119.386 308.707 124.888 304.245 130.068C304.103 130.237 303.96 130.407 303.813 130.582C299.738 135.053 293.622 136.594 287.88 137.43C287.697 137.457 287.515 137.484 287.327 137.511C286.636 137.579 285.939 137.568 285.245 137.568C285.245 115.623 285.245 93.6779 285.245 71.0679Z'],
  ['#B3CAD4', 'M40.2455 71.5679C40.2455 93.1829 40.2455 114.798 40.2455 137.068C33.8168 136.211 28.005 133.808 23.9086 128.567C21.0399 124.664 19.4645 120.275 19.4512 115.441C19.4496 115.179 19.448 114.917 19.4463 114.648C19.4413 113.784 19.4384 112.919 19.4359 112.055C19.4349 111.759 19.4339 111.462 19.4328 111.156C19.4276 109.584 19.4241 108.011 19.4217 106.439C19.419 104.825 19.4104 103.21 19.4004 101.596C19.3938 100.347 19.3918 99.0972 19.3909 97.8478C19.3897 97.2533 19.3868 96.6588 19.3821 96.0643C19.3516 91.9125 19.5034 87.9182 21.4017 84.1304C21.4864 83.9567 21.571 83.783 21.6582 83.6041C24.4489 78.1021 29.1483 74.5124 34.8839 72.5135C36.6255 71.9566 38.4127 71.5679 40.2455 71.5679Z'],
  ['#97B2BD', 'M65.9956 300.818C66.2224 300.894 66.4492 300.971 66.6829 301.05C83.8333 306.826 101.119 311.839 118.996 314.818C118.996 318.778 118.996 322.738 118.996 326.818C119.738 326.9 120.481 326.983 121.246 327.068C121.996 327.184 122.745 327.304 123.494 327.431C123.932 327.504 124.37 327.576 124.809 327.649C125.038 327.687 125.267 327.724 125.502 327.763C131.139 328.69 136.786 329.417 142.467 330.012C142.93 330.061 143.393 330.111 143.856 330.16C145.484 330.333 147.112 330.464 148.746 330.568C148.911 330.579 149.076 330.589 149.247 330.6C169.037 331.868 189.084 330.811 208.564 326.984C209.496 326.818 209.496 326.818 210.496 326.818C210.496 322.858 210.496 318.898 210.496 314.818C212.274 314.493 214.053 314.168 215.886 313.834C232.147 310.808 247.826 306.056 263.496 300.818C263.473 301.23 263.446 301.641 263.417 302.052C263.396 302.396 263.396 302.396 263.373 302.747C263.039 304.891 263.039 304.891 262.496 305.818C261.728 306.352 260.902 306.585 260.009 306.844C259.628 306.967 259.628 306.967 259.239 307.092C258.4 307.359 257.558 307.612 256.714 307.865C256.125 308.048 255.537 308.232 254.948 308.417C253.135 308.982 251.316 309.527 249.496 310.068C249.218 310.151 248.941 310.234 248.655 310.319C243.061 311.992 237.441 313.556 231.777 314.974C231.578 315.024 231.38 315.074 231.176 315.125C228.474 315.798 225.761 316.397 223.034 316.957C222.542 317.058 222.051 317.161 221.56 317.263C220.763 317.43 219.965 317.593 219.167 317.755C218.903 317.811 218.639 317.866 218.367 317.922C218.111 317.974 217.856 318.026 217.592 318.08C217.368 318.126 217.145 318.172 216.914 318.219C216.246 318.318 216.246 318.318 214.746 318.318C214.746 322.195 214.746 326.073 214.746 330.068C210.135 331.221 210.135 331.221 208.447 331.504C208.251 331.538 208.055 331.573 207.853 331.608C207.224 331.716 206.594 331.822 205.964 331.927C205.632 331.983 205.632 331.983 205.294 332.04C197.596 333.332 189.895 334.227 182.117 334.869C181.919 334.885 181.72 334.902 181.516 334.919C177.831 335.215 174.155 335.359 170.458 335.369C170.035 335.37 169.612 335.372 169.189 335.374C167.843 335.379 166.497 335.38 165.152 335.38C164.808 335.381 164.808 335.381 164.457 335.381C157.655 335.382 150.887 335.327 144.114 334.631C143.465 334.565 142.816 334.501 142.166 334.438C118.898 332.144 118.898 332.144 114.746 330.068C114.746 326.19 114.746 322.313 114.746 318.318C113.838 318.235 112.931 318.153 111.996 318.068C111.334 317.961 110.674 317.843 110.016 317.711C109.836 317.676 109.657 317.64 109.472 317.603C108.88 317.484 108.289 317.362 107.699 317.24C107.49 317.197 107.282 317.154 107.067 317.11C97.9277 315.213 88.9085 312.818 79.9957 310.051C79.4742 309.889 78.9527 309.728 78.431 309.567C76.7176 309.038 75.0064 308.502 73.2978 307.958C72.7452 307.782 72.1922 307.608 71.6387 307.436C70.8699 307.196 70.1035 306.949 69.3373 306.701C69.1069 306.63 68.8765 306.559 68.6391 306.486C67.0882 305.973 67.0882 305.973 66.6091 305.173C66.5529 304.873 66.5529 304.873 66.4956 304.568C66.4433 304.383 66.3911 304.197 66.3373 304.006C66.2967 303.826 66.2561 303.645 66.2143 303.459C66.1724 303.278 66.1305 303.098 66.0873 302.913C65.9787 302.209 65.9898 301.529 65.9956 300.818Z'],
  ['#EBF3F7', 'M99.2583 31.648C100.633 32.7251 101.393 34.1166 101.746 35.8179C101.99 37.8743 101.374 39.5213 100.324 41.2711C98.378 43.1116 95.7778 43.6119 93.267 44.2869C80.6614 47.6916 69.0296 52.8347 58.9956 61.3179C58.7094 61.5548 58.7094 61.5548 58.4175 61.7965C57.3397 62.7081 56.3405 63.6989 55.3393 64.6929C55.1966 64.8345 55.0538 64.9761 54.9068 65.1219C54.1896 65.8419 53.5386 66.5618 52.9331 67.3804C52.1299 68.1836 51.6583 68.3614 50.5425 68.4009C49.5355 68.2481 49.1544 67.8421 48.4956 67.0679C48.1428 65.8333 48.3422 64.8584 48.7143 63.6617C48.7702 63.4788 48.826 63.296 48.8836 63.1076C52.4244 52.0279 60.6156 43.6978 70.752 38.3206C77.0936 35.0738 92.4839 27.2866 99.2583 31.648Z'],
  ['#7EFFE0', 'M120.245 98.068C120.42 98.1489 120.596 98.2297 120.776 98.3131C124.6 100.204 127.303 103.82 128.747 107.754C129.626 110.559 129.984 113.75 128.995 116.568C128.402 117.652 127.901 118.351 126.745 118.818C124.551 119.243 122.403 118.941 120.214 118.659C114.776 117.968 109.857 118.037 104.423 118.734C99.4931 119.352 99.4931 119.352 97.7607 118.271C96.632 117.35 96.2201 116.225 95.9951 114.818C95.7202 109.992 96.9018 105.852 99.9951 102.068C100.62 101.38 100.62 101.38 101.245 100.818C101.376 100.686 101.507 100.554 101.643 100.418C106.482 95.7727 114.408 95.0278 120.245 98.068Z'],
  ['#7EFFE0', 'M227.54 100.222C230.536 102.658 232.662 106.508 233.245 110.318C233.321 111.183 233.348 112.043 233.355 112.912C233.357 113.12 233.36 113.328 233.362 113.542C233.338 115.279 233.045 116.716 231.839 118.037C230.018 119.184 228.199 119.119 226.12 118.88C225.759 118.844 225.759 118.844 225.391 118.806C224.12 118.675 222.853 118.519 221.586 118.352C217.125 117.78 212.866 118.165 208.424 118.734C203.675 119.328 203.675 119.328 201.776 118.427C200.609 117.516 200.176 116.511 199.808 115.099C199.435 110.445 200.618 106.039 203.559 102.364C209.934 95.0313 219.898 94.5521 227.54 100.222Z'],
  ['#70FFDB', 'M152.351 138.073C152.653 138.071 152.653 138.071 152.962 138.069C153.182 138.07 153.401 138.071 153.627 138.072C153.859 138.071 154.092 138.07 154.332 138.069C155.101 138.067 155.869 138.068 156.638 138.07C157.173 138.07 157.707 138.069 158.241 138.069C159.361 138.068 160.481 138.069 161.6 138.071C163.036 138.074 164.472 138.073 165.908 138.07C167.011 138.068 168.114 138.068 169.218 138.07C169.747 138.07 170.277 138.069 170.806 138.068C171.546 138.067 172.285 138.069 173.025 138.072C173.244 138.071 173.464 138.07 173.69 138.069C173.992 138.071 173.992 138.071 174.301 138.073C174.476 138.073 174.651 138.073 174.831 138.074C175.42 138.148 175.818 138.333 176.326 138.636C177.256 139.897 176.765 141.687 176.576 143.136C175.959 146.374 173.932 149.281 171.288 151.212C167.989 153.317 164.703 154.093 160.787 153.521C157.279 152.737 154.252 150.955 152.217 147.949C152 147.596 151.786 147.242 151.576 146.886C151.437 146.685 151.297 146.484 151.154 146.277C150.126 144.27 149.302 141.262 150.01 139.064C150.61 138.251 151.376 138.074 152.351 138.073Z'],
];

/* Ant Design arrow-up (MIT), 1024-unit viewBox. */
const ARROW_UP = 'M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6.1-13.2z';

const POINTER = 'M5 2 L5 19 L9.6 14.6 L12.4 21.4 L15.6 20 L12.8 13.4 L19 13.4 Z';
const QUESTION = 'Var finns risken i uppdraget?';

/* Camera framings for the world (hard cuts) */
const SHOTS = {
  chat: 'scale(1.5) translate(-183.75px, -163.04px)', //  the corner at 150%
  cite: 'scale(2) translate(-330.84px, -246.31px)', //    the answer at 200%
} as const;

interface AnimState {
  reset: boolean;
  shot: 1 | 2 | 3;
  pointer: boolean; //     close-up pointer in
  tap: boolean; //         pointer down on little Ally (spring + ripple)
  panel: boolean; //       the chat panel is up, little Ally gone
  pointerOut: boolean; //  the world pointer leaves
  focus: boolean;
  typed: number;
  send: boolean; //        send disc pressed
  sent: boolean;
  answer: boolean;
  citePointer: boolean;
  citeTap: boolean;
  open: boolean; //        the source is up, the answer dims
}

const INITIAL: AnimState = { reset: true, shot: 1, pointer: false, tap: false, panel: false, pointerOut: false, focus: false, typed: 0, send: false, sent: false, answer: false, citePointer: false, citeTap: false, open: false };
const FINAL: AnimState = { ...INITIAL, shot: 3, panel: true, pointerOut: true, sent: true, answer: true, open: true };

/* The whole timeline: [delay after the previous step (ms), state transition]. */
type Step = [number, (s: AnimState) => AnimState];
const CHAR_MS = 55;
const char: Step = [CHAR_MS, (s) => ({ ...s, typed: s.typed + 1 })];
const STEPS: Step[] = [
  [0, () => INITIAL], //                                                         0.000 reset (transitions off)
  [40, (s) => ({ ...s, reset: false })], //                                       0.040
  [1020, (s) => ({ ...s, pointer: true })], //                                    1.060 pointer fades in
  [320, (s) => ({ ...s, tap: true })], //                                         1.380 tap: spring + ripple
  [120, (s) => ({ ...s, shot: 2, panel: true })], //                              1.500 cut out; the panel rises, Ally exits
  [320, (s) => ({ ...s, pointerOut: true, focus: true })], //                     1.820 pointer leaves; field ink
  [100, (s) => ({ ...s, typed: 1 })], //                                          1.920 typing
  ...Array.from({ length: QUESTION.length - 1 }, () => char), //                 → 3.460
  [205, (s) => ({ ...s, send: true, focus: false })], //                          3.665 send pressed
  [120, (s) => ({ ...s, send: false, sent: true, typed: 0 })], //                 3.785 the question lands
  [300, (s) => ({ ...s, answer: true })], //                                      4.085 the answer rises in
  [605, (s) => ({ ...s, shot: 3 })], //                                           4.690 cut to the answer
  [250, (s) => ({ ...s, citePointer: true })], //                                 4.940 pointer on the citation
  [320, (s) => ({ ...s, citeTap: true })], //                                     5.260 tap
  [120, (s) => ({ ...s, citeTap: false, open: true })], //                        5.380 the source rises, the answer dims
  [1810, (s) => s], //                                                            hold to 7.190
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function Els({ items }: { items: El[] }) {
  return (
    <>
      {items.map((e, i) => {
        if (e.k === 'box') return <div key={i} className={styles.box} style={e.s} />;
        if (e.k === 'text') return <div key={i} className={styles.text} style={e.s}>{e.t}</div>;
        return (
          <svg key={i} className={styles.icon} style={e.s} viewBox={e.vb} fill="currentColor"
            stroke={e.stroke ? 'currentColor' : undefined} strokeWidth={e.sw || undefined} strokeLinejoin="round" aria-hidden="true">
            {e.p.map(([fill, d], j) => <path key={j} d={d as string} fill={fill ?? undefined} />)}
          </svg>
        );
      })}
    </>
  );
}

function AllyGlyph() {
  return (
    <svg className={styles.allySvg} viewBox="0 0 328 399" fill="none" aria-hidden="true">
      {ALLY_PATHS.map(([fill, d], i) => <path key={i} d={d} fill={fill} />)}
    </svg>
  );
}

function Pointer({ className, on, down }: { className: string; on: boolean; down: boolean }) {
  return (
    <div className={className} data-on={on || undefined} data-down={down || undefined}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={POINTER} fill="#101829" stroke="#ffffff" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/*
 * Site integration: `paused` (Media sets it while the frame is off screen)
 * stops the timeline where it is; it carries on from the same step when
 * the frame comes back. Reduced motion shows the final frame, still.
 */
export function AllyOpenFilm({ className, paused = false }: { className?: string; paused?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [state, setS] = useState<AnimState>(INITIAL);
  /* the next step to run — kept across pauses */
  const stepRef = useRef(0);

  useEffect(() => {
    if (reduced || paused) return;
    let timer: ReturnType<typeof setTimeout>;
    const run = () => {
      const [, fn] = STEPS[stepRef.current];
      setS((prev) => fn(prev));
      stepRef.current = (stepRef.current + 1) % STEPS.length;
      timer = setTimeout(run, STEPS[stepRef.current][0]);
    };
    timer = setTimeout(run, STEPS[stepRef.current][0]);
    return () => clearTimeout(timer);
  }, [reduced, paused]);

  const s = reduced ? FINAL : state;
  const still = reduced || state.reset;
  const text = s.sent ? '' : QUESTION.slice(0, s.typed);

  return (
    <div className={[styles.canvas, className].filter(Boolean).join(' ')} data-still={still || undefined} aria-hidden="true">
      {/* 1 · the close-up — the page drawn big */}
      <div className={styles.macro} data-on={s.shot === 1 || undefined}>
        <Els items={MACRO.page} />
        <Els items={MACRO.tablepanel} />
        <div className={styles.macroTable}><div className={styles.macroTableIn}><Els items={MACRO.table} /></div></div>
        <div className={styles.macroAlly} data-tap={s.tap || undefined}>
          <div className={styles.macroRipple} data-on={s.tap || undefined} />
          <div className={styles.macroBob}>
            <div className={styles.macroPress}>
              <AllyGlyph />
              <div className={styles.macroShadow} />
            </div>
          </div>
        </div>
        <Pointer className={styles.macroPointer} on={s.pointer} down={s.tap} />
      </div>

      {/* 2 · 3 · the page, framed by the camera */}
      <div className={styles.world} data-on={s.shot > 1 || undefined} style={{ transform: s.shot === 3 ? SHOTS.cite : SHOTS.chat }}>
        <Els items={WORLD.page} />
        <Els items={WORLD.tablepanel} />
        <div className={styles.table}><div className={styles.tableIn}><Els items={WORLD.table} /></div></div>

        <div className={styles.launcher} data-gone={s.panel || undefined}>
          <AllyGlyph />
          <div className={styles.launcherShadow} />
        </div>
        <Pointer className={styles.worldPointer} on={!s.pointerOut} down={false} />

        <div className={styles.panel} data-on={s.panel || undefined}>
          <Els items={WORLD.panel} />
          <svg className={styles.panelAlly} viewBox="0 0 328 399" fill="none" aria-hidden="true">
            {ALLY_PATHS.map(([fill, d], i) => <path key={i} d={d} fill={fill} />)}
          </svg>
          <div className={styles.rise} data-on={s.sent || undefined} style={{ '--aof-d': '0ms' } as CSSProperties}><Els items={WORLD.q} /></div>
          <div className={styles.rise} data-on={s.answer || undefined} style={{ '--aof-d': '0ms' } as CSSProperties}>
            <div className={styles.dim} data-on={s.open || undefined}><Els items={WORLD.a0} /></div>
            <div className={styles.chip} data-down={s.citeTap || undefined}><Els items={WORLD.chip} /></div>
          </div>
          <div className={styles.rise} data-on={s.answer || undefined} style={{ '--aof-d': '80ms' } as CSSProperties}>
            <div className={styles.dim} data-on={s.open || undefined}><Els items={WORLD.a1} /></div>
          </div>
          <Els items={WORLD.composer.filter((e) => e.k !== 'svg')} />
          <div className={styles.field} data-focus={s.focus || undefined}>
            <div className={styles.input} data-empty={!text || undefined}>{text || 'Fråga om uppdraget…'}</div>
          </div>
          <div className={styles.send} data-ready={!!text || undefined} data-down={s.send || undefined}>
            <svg viewBox="0 0 1024 1024" width={7} height={7} fill="currentColor" stroke="currentColor" strokeWidth={16} strokeLinejoin="round" aria-hidden="true">
              <path d={ARROW_UP} />
            </svg>
          </div>
        </div>

        {/* the source, risen off the citation */}
        <div className={styles.source} data-on={s.open || undefined}>
          <div className={styles.sourceTitle}>15. Kundfordringar</div>
          <div className={styles.sourceLine}>Balansräkning · Tillgångar</div>
          <div className={styles.sourceLine}>2 varningar ej hanterade</div>
        </div>
        <div className={styles.sourceTip} data-on={s.open || undefined} />
        <Pointer className={styles.citePointer} on={s.citePointer} down={s.citeTap} />
      </div>
    </div>
  );
}

export default AllyOpenFilm;
