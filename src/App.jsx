import { useState } from "react";
import Input from "./components/Input";
import LineChart from "./components/LineChart";
import { formater } from "./utils/dataFormater";
import './style.css'
import Header from "./components/Header";
import swal from 'sweetalert2'

function App() {

  const [textareaValue, setTextareaValue] = useState("")
  const [chartData, setChartData] = useState([])
  const [chartLabel, setChartLabel] = useState([])

  function createNewChart() {
    if(textareaValue !== "") {
      const [dataset, label] = formater(textareaValue)
      
      if(dataset && label) {
        setChartData(dataset)
        setChartLabel(label)
      }
      
    }
    else {
      swal.fire({
        title: "Ops... Empty text field!!",
        text: 'Please insert some data. We need a start, span, data and stop.',
        icon: 'error'
      })
    }
  }

  return (
    <div className="app-container">
    <Header />
    <Input textareavalue={textareaValue} settextareavalue={setTextareaValue} />
    <LineChart labels={chartLabel} datasets={chartData} />
    <div className="button-wrapper">
      <button data-cy="button-chart" type="button" onClick={createNewChart}>Generate chart</button>
    </div>
    </div>
  );
}

export default App;
