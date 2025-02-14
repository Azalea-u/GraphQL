export function renderXPChart(xpData) {
    if (!xpData || xpData.length === 0) return '<p>No XP data available</p>';

    const width = 800;
    const height = 480;
    const padding = 60;
    const n = xpData.length;

    // Calculate cumulative XP values
    let cumulativeXP = 0;
    const cumulativeXPData = xpData.map((entry) => {
        cumulativeXP += entry.amount;
        return { ...entry, cumulativeXP };
    });

    const maxXP = cumulativeXPData[cumulativeXPData.length - 1].cumulativeXP; // Highest XP value

    // Function to convert bytes to a readable format (KB, MB, GB) using base-10 (1000)
    const formatBytes = (bytes) => {
        if (bytes >= 1000 ** 3) return `${(bytes / 1000 ** 3).toFixed(1)} GB`; // Gigabytes
        if (bytes >= 1000 ** 2) return `${(bytes / 1000 ** 2).toFixed(1)} MB`; // Megabytes
        if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`; // Kilobytes
        return `${bytes} B`; // Bytes
    };

    const xScale = (index) => padding + index * ((width - 2 * padding) / (n - 1));
    const yScale = (xp) => height - padding - (xp / maxXP * (height - 2 * padding));

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
        ${[0.25, 0.5, 0.75, 1].map(v => {
            const xpValue = v * maxXP;
            return `
                <line x1="${padding}" y1="${yScale(xpValue)}" x2="${width - padding}" y2="${yScale(xpValue)}"
                      stroke="#00FF00" stroke-width="1" stroke-dasharray="4"/>
                <text x="${padding - 10}" y="${yScale(xpValue) + 5}" font-size="12" text-anchor="end" fill="#00FF00" style="text-shadow: 0 0 5px #00FF00;">
                    ${formatBytes(xpValue)}
                </text>
            `;
        }).join("")}

        <!-- X Axis -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#00FF00" stroke-width="2"/>
        <text x="${width / 2}" y="${height - 20}" font-size="14" text-anchor="middle" fill="#00FF00" style="text-shadow: 0 0 5px #00FF00;">Time (Progress)</text>

        <!-- Y Axis -->
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#00FF00" stroke-width="2"/>
        <text x="20" y="${height / 2}" font-size="14" text-anchor="middle" fill="#00FF00" transform="rotate(-90,20,${height / 2})" style="text-shadow: 0 0 5px #00FF00;">
            Total XP
        </text>

        <!-- XP Data Line -->
        <polyline fill="none" stroke="#00FF00" stroke-width="3" 
            points="${cumulativeXPData.map((p, i) => `${xScale(i)},${yScale(p.cumulativeXP)}`).join(' ')}" />

        <!-- XP Points with Hover Tooltips -->
        ${cumulativeXPData.map((point, index) => {
            const x = xScale(index);
            const y = yScale(point.cumulativeXP);
            return `
                <circle cx="${x}" cy="${y}" r="5" fill="#00FF00">
                    <title>${formatBytes(point.cumulativeXP)}</title>
                </circle>
            `;
        }).join("")}

        <!-- Display Total XP -->
        <text x="${width - padding}" y="${padding - 10}" font-size="14" text-anchor="end" fill="#00FF00" style="text-shadow: 0 0 5px #00FF00;">
            Total XP: ${formatBytes(maxXP)}
        </text>
    </svg>
    `;
}
