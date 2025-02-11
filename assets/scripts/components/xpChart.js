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

    const xScale = (index) => padding + index * ((width - 2 * padding) / (n - 1));
    const yScale = (xp) => height - padding - (xp / maxXP * (height - 2 * padding));

    return `
    <svg width="${width}" height="${height}" style="background: #fff; border: 1px solid #ccc;">
        <!-- Grid Lines -->
        ${[0.25, 0.5, 0.75, 1].map(v => `
            <line x1="${padding}" y1="${yScale(v * maxXP)}" x2="${width - padding}" y2="${yScale(v * maxXP)}"
                  stroke="#ddd" stroke-width="1" stroke-dasharray="4"/>
            <text x="${padding - 10}" y="${yScale(v * maxXP) + 5}" font-size="12" text-anchor="end">
                ${(v * maxXP / 1000).toFixed(1)}K XP
            </text>
        `).join("")}

        <!-- X Axis -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="black" stroke-width="2"/>
        <text x="${width / 2}" y="${height - 20}" font-size="14" text-anchor="middle">Time (Progress)</text>

        <!-- Y Axis -->
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="black" stroke-width="2"/>
        <text x="20" y="${height / 2}" font-size="14" text-anchor="middle" transform="rotate(-90,20,${height / 2})">
            Total XP
        </text>

        <!-- XP Data Line -->
        <polyline fill="none" stroke="#0074d9" stroke-width="3" 
            points="${cumulativeXPData.map((p, i) => `${xScale(i)},${yScale(p.cumulativeXP)}`).join(' ')}" />

        <!-- XP Points with Hover Tooltips -->
        ${cumulativeXPData.map((point, index) => {
            const x = xScale(index);
            const y = yScale(point.cumulativeXP);
            return `
                <circle cx="${x}" cy="${y}" r="5" fill="#0074d9">
                    <title>${(point.cumulativeXP / 1000).toFixed(1)}K XP</title>
                </circle>
            `;
        }).join("")}
    </svg>
    `;
}
