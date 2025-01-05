import 'chart.js/auto';
import {Line} from "react-chartjs-2";
import {useAnalyzerStore, useReplayStore, useVelocityGraphStore} from "../../../stores/analyzerstore.ts";
import {useMemo} from "react";
import {getVelocityPoints} from "../../../utills/scattutils.ts";
import {getMaxFrames} from "../../../utills/shotcanvas/methods.ts";

const options = {
    elements: {
        point: {
            radius: 0,
        }
    },
    scales: {
        y: {
            min: 0,
            max: 40,
        }
    },
    plugins: {
        zoom: {
            zoom: {
                wheel: {
                    enabled: true,
                    modifierKey: 'shift',
                },
                mode: 'x',
            },
            pan: {
                enabled: true,
                mode: 'x',
                threshold: 0,
            },
            pinch: {
                enabled: false,
            },
            drag: {
                enabled: false,
            },
            mode: 'x',
        }
    }
}

const VelocityGraph = () => {
    const [velocityGraph] = useVelocityGraphStore((state) => [state.velocityGraph]);
    const [currentShotIdx, shots] = useAnalyzerStore((state) => [state.currentShotIdx, state.shots]);
    const [trace, frameIdx] = useReplayStore((state) => [state.trace, state.frameIdx]);

    const data = useMemo(() => {
        if (currentShotIdx === -1) return null;
        if (velocityGraph === null) return null;

        const currentShot = shots[currentShotIdx];
        const maxFrames = getMaxFrames(trace);
        const cleansedGraph = getVelocityPoints(velocityGraph, currentShot, trace, maxFrames);
        const shotTimeStart = velocityGraph[0].t;
        const shotTimeEnd = velocityGraph[velocityGraph.length - 1].t;

        // shotTimeStart will be around -6.5s and shotTimeEnd at around 1s
        // create a list ranging from -6s to 1s for the labels
        const labels = [];

        for (let i = -2; i <= Math.ceil(shotTimeEnd); i++) {
            labels.push(String(i));
        }

        const d = {
            labels: labels,
            datasets: [
                {
                    label: 'Velocity',
                    data: cleansedGraph.map((point) => point.v),
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                }
            ]
        }

        return d;
    }, [currentShotIdx, frameIdx, shots, trace, velocityGraph]);

    if (data === null) return null;

    console.log(data)

    return (
        <Line data={data} options={options} />
    )
}

export default VelocityGraph;
