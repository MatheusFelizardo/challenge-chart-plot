
import { Line } from 'react-chartjs-2';
import {defaults} from 'react-chartjs-2'

defaults.animation = false
defaults.font.family = "'Source Code Pro', 'monospace'"
defaults.font.size = 12
defaults.font.weight = "500"

const LineChart = ({datasets, labels}) => {

    return (
        <div data-cy="chart-wrapper" className="chart-wrapper">
        <Line 
            data = {{ labels, datasets }}
            type={'line'} 
            width={150}
            height={50}
            options={{
                
                layout: {
                    padding: {
                        left: 18,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                plugins:{
                    legend: {
                        display: true,
                        position: 'right'
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            display:false,
                            padding: 20
                        }
                    }
                }
            }}
        />
        </div>
    )
}

export default LineChart
