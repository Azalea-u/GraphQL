export function renderRadarChart(skillsData) {
    if (!skillsData || skillsData.length === 0) return '<p>No skills data available</p>';

    // Chart Constants
    const width = 450, height = 450;
    const cx = width / 2, cy = height / 2;
    const radius = 160;
    const maxValue = 100; // Fixed max value for normalization
    const angleStep = (2 * Math.PI) / skillsData.length;

    // Reorganize skills for better symmetry
    const sortedSkills = [...skillsData].sort((a, b) => b.amount - a.amount);
    const reorderedSkills = [];
    for (let i = 0; i < sortedSkills.length; i += 2) {
        reorderedSkills.push(sortedSkills[i]);
        if (sortedSkills[i + 1]) reorderedSkills.unshift(sortedSkills[i + 1]);
    }

    // Generate Grid Circles
    const gridCircles = [0.25, 0.5, 0.75, 1].map(fraction => `
        <circle cx="${cx}" cy="${cy}" r="${radius * fraction}" fill="none" stroke="#00FF00" stroke-dasharray="3,3"/>
    `).join("");

    // Generate Axes and Labels
    const axesAndLabels = reorderedSkills.map((skill, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const labelX = cx + (radius + 25) * Math.cos(angle);
        const labelY = cy + (radius + 25) * Math.sin(angle);
        const label = skill.type.replace('skill_', '').replace(/\b\w/g, l => l.toUpperCase());

        return `
            <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#00FF00" stroke-width="1"/>
            <text x="${labelX}" y="${labelY}" font-family="Courier New, monospace" font-size="12" fill="#00FF00"
                  text-anchor="middle" style="text-shadow: 0 0 5px #00FF00;">
                ${label} (${skill.amount})
            </text>
        `;
    }).join("");

    // Generate Polygon Points
    const polygonPoints = reorderedSkills.map((skill, i) => {
        const normalizedValue = Math.min(skill.amount, maxValue) / maxValue; // Ensure values don't exceed 100
        const r = normalizedValue * radius;
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(" ");

    // SVG Chart Output
    return `
    <svg width="${width}" height="${height}" style="background: #000; border: 1px solid #00FF00;">
        <!-- CRT Scan Lines -->
        <defs>
            <pattern id="scanlines" width="1" height="4" patternUnits="userSpaceOnUse">
                <rect width="1" height="1" fill="rgba(0, 255, 0, 0.1)"></rect>
                <rect y="2" width="1" height="1" fill="rgba(0, 255, 0, 0.1)"></rect>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#scanlines)"></rect>

        <!-- Grid Circles -->
        ${gridCircles}

        <!-- Axes and Labels -->
        ${axesAndLabels}

        <!-- Radar Polygon -->
        <polygon points="${polygonPoints}" fill="rgba(0, 255, 0, 0.3)" stroke="#00FF00" stroke-width="2"/>
    </svg>
    `;
}
