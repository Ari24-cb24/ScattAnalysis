export const calculate_velocities = (shots) => {
    const velocities = []
    for (let i = 0; i < shots.length; i++) {
        const shot = shots[i];
        velocities.push(calculate_velocity_graph(shot));
    }
    return velocities;
}

const calculate_velocity_graph = (shot) => {
    /*
    "trace": [
        { "t": -6.164, "x": -3.69, "y": -40.04 },
        { "t": -6.156, "x": -3.65, "y": -40.01 },
        { "t": -6.148, "x": -3.50, "y": -40.00 },
        ...
     */
    const trace = shot.trace;
    const velocities = [];

    for (let i = 0; i < trace.length - 1; i++) {
        const point = trace[i];
        const next_point = trace[i + 1];

        const dx = next_point.x - point.x;
        const dy = next_point.y - point.y;
        const dt = next_point.t - point.t;

        const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
        const data = {
            "t": point.t,
            "v": velocity
        }
        velocities.push(data);
    }

    return velocities;
}
