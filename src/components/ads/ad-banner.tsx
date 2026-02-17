"use client";

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    type: 'sidebar' | 'horizontal' | 'native';
    className?: string;
}

export default function AdBanner({ type, className }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = '';

        const width = type === 'sidebar' ? 160 : type === 'horizontal' ? 320 : '100%';
        const height = type === 'sidebar' ? 600 : type === 'horizontal' ? 50 : 250;

        const iframe = document.createElement('iframe');
        iframe.width = typeof width === 'number' ? `${width}px` : width.toString();
        iframe.height = `${height}px`;
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.style.background = "transparent";

        let adHtml = '';

        if (type === 'native') {
            adHtml = `
                <html>
                    <body style="margin:0;padding:0;background:transparent;display:flex;justify-content:center;">
                        <script async="true" data-cfasync="false" src="https://offevasionrecruit.com/6bf4cecee8e3a1caceb26ac530156006/invoke.js"></script>
                        <div id="container-6bf4cecee8e3a1caceb26ac530156006"></div>
                    </body>
                </html>
            `;
        } else {
            const key = type === 'sidebar' ? '40b66dd01e8c09a129b06a4b175baaf5' : 'ab1497b9fc6d24be92f1091c434e74d8';
            adHtml = `
                <html>
                    <body style="margin:0;padding:0;background:transparent;display:flex;justify-content:center;">
                        <script type="text/javascript">
                            atOptions = {
                                'key' : '${key}',
                                'format' : 'iframe',
                                'height' : ${height},
                                'width' : ${width},
                                'params' : {}
                            };
                        </script>
                        <script type="text/javascript" src="https://offevasionrecruit.com/${key}/invoke.js"></script>
                    </body>
                </html>
            `;
        }

        iframe.srcdoc = adHtml;
        containerRef.current.appendChild(iframe);
    }, [type]);

    return (
        <div
            className={cn(
                "mx-auto flex justify-center items-center my-2 overflow-hidden",
                type === 'sidebar' ? 'w-[160px] h-[600px]' :
                    type === 'horizontal' ? 'w-[320px] h-[50px]' :
                        'w-full min-h-[100px]',
                className
            )}
            ref={containerRef}
        />
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

