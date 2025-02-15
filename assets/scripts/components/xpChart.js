export function renderXPChart(xpData) {
    if (!xpData || xpData.length === 0) return '<p>No XP data available</p>';

    // Chart Constants
    const width = 800, height = 480, padding = 60;
    const n = xpData.length;

    // Compute cumulative XP values
    let cumulativeXP = 0;
    const cumulativeXPList = xpData.map(entry => ({
        ...entry,
        cumulativeXP: (cumulativeXP += entry.amount)
    }));

    const maxXP = cumulativeXPList[cumulativeXPList.length - 1].cumulativeXP;

    // Format bytes into readable sizes (KB, MB, GB)
    const formatBytes = bytes =>
        bytes >= 1e9 ? `${(bytes / 1e9).toFixed(1)} GB` :
        bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` :
        bytes >= 1e3 ? `${(bytes / 1e3).toFixed(1)} KB` :
        `${bytes} B`;

    // Scales for positioning
    const xScale = i => padding + i * ((width - 2 * padding) / (n - 1));
    const yScale = xp => height - padding - (xp / maxXP * (height - 2 * padding));

    return `
    <svg width="${width}" height="${height}" style="background: #000; border: 1px solid #00FF00; font-family: 'Courier New', monospace;">
        <!-- CRT Scan Lines -->
        <defs>
            <pattern id="scanlines" width="1" height="4" patternUnits="userSpaceOnUse">
                <rect width="1" height="1" fill="rgba(0, 255, 0, 0.1)"></rect>
                <rect y="2" width="1" height="1" fill="rgba(0, 255, 0, 0.1)"></rect>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#scanlines)"></rect>

        <!-- Grid Lines -->
        ${[0.25, 0.5, 0.75, 1].map(fraction => {
            const xpValue = fraction * maxXP;
            return `
                <line x1="${padding}" y1="${yScale(xpValue)}" x2="${width - padding}" y2="${yScale(xpValue)}"
                      stroke="#00FF00" stroke-width="1" stroke-dasharray="4"/>
                <text x="${padding - 10}" y="${yScale(xpValue) + 5}" font-size="12" text-anchor="end" fill="#00FF00"
                      style="text-shadow: 0 0 5px #00FF00;">
                    ${formatBytes(xpValue)}
                </text>
            `;
        }).join("")}

        <!-- X Axis -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#00FF00" stroke-width="2"/>
        <text x="${width / 2}" y="${height - 20}" font-size="14" text-anchor="middle" fill="#00FF00"
              style="text-shadow: 0 0 5px #00FF00;">
            Time (Progress)
        </text>

        <!-- Y Axis -->
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#00FF00" stroke-width="2"/>
        <text x="20" y="${height / 2}" font-size="14" text-anchor="middle" fill="#00FF00"
              transform="rotate(-90,20,${height / 2})" style="text-shadow: 0 0 5px #00FF00;">
            Total XP
        </text>

        <!-- XP Data Line -->
        <polyline fill="none" stroke="#00FF00" stroke-width="3" 
            points="${cumulativeXPList.map((p, i) => `${xScale(i)},${yScale(p.cumulativeXP)}`).join(' ')}" />

        <!-- XP Points with Tooltips -->
        ${cumulativeXPList.map((point, index) => `
            <circle cx="${xScale(index)}" cy="${yScale(point.cumulativeXP)}" r="5" fill="#00FF00">
                <title>${formatBytes(point.cumulativeXP)}</title>
            </circle>
        `).join("")}

        <!-- Total XP Display -->
        <text x="${width - padding}" y="${padding - 10}" font-size="14" text-anchor="end" fill="#00FF00"
              style="text-shadow: 0 0 5px #00FF00;">
            Total XP: ${formatBytes(maxXP)}
        </text>
    </svg>
    `;
}
