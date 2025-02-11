export function renderRadarChart(skillsData) {
    // Early return if no data is provided
    if (!skillsData || skillsData.length === 0) return '<p>No skills data available</p>';

    // Constants for the chart
    const width = 450, height = 450;
    const cx = width / 2, cy = height / 2;
    const radius = 160;
    const numSkills = skillsData.length;
    const maxValue = Math.max(...skillsData.map(skill => skill.amount));
    const angleStep = (2 * Math.PI) / numSkills;

    // Function to generate grid circles
    const generateGridCircles = () => {
        return [0.25, 0.5, 0.75, 1].map(fraction => `
            <circle cx="${cx}" cy="${cy}" r="${radius * fraction}" fill="none" stroke="#ccc" stroke-dasharray="3,3"/>
        `).join("");
    };

    // Function to generate axes
    const generateAxes = () => {
        return skillsData.map((skill, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#bbb" stroke-width="1"/>`;
        }).join("");
    };

    // Function to generate labels
    const generateLabels = () => {
        return skillsData.map((skill, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + (radius + 25) * Math.cos(angle);
            const y = cy + (radius + 25) * Math.sin(angle);
            // Remove 'skill_' prefix and capitalize the first letter
            const label = skill.type.replace('skill_', '').replace(/\b\w/g, l => l.toUpperCase());
            return `<text x="${x}" y="${y}" font-family="Arial" font-size="12" fill="#333" text-anchor="middle">
                ${label} (${skill.amount})
            </text>`;
        }).join("");
    };

    // Function to generate polygon points
    const generatePolygonPoints = () => {
        return skillsData.map((skill, i) => {
            const normalizedValue = skill.amount / maxValue;
            const r = normalizedValue * radius;
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(" ");
    };

    // Generate the SVG content
    const gridCircles = generateGridCircles();
    const axes = generateAxes();
    const labels = generateLabels();
    const points = generatePolygonPoints();

    return `
    <svg width="${width}" height="${height}" style="background: #fff; border: 1px solid #ccc;">
        <!-- Grid -->
        ${gridCircles}

        <!-- Axes -->
        ${axes}

        <!-- Skills Polygon -->
        <polygon points="${points}" fill="rgba(0, 116, 217, 0.5)" stroke="#0074d9" stroke-width="2"/>

        <!-- Labels -->
        ${labels}
    </svg>
    `;
}