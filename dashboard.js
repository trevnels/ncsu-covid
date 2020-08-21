let placeholderData = {
    "Aug. 18": {
      "cases": {
        "student": 27,
        "employee": 1,
        "total": 28
      },
      "quarantine": {
        "unitsTotal": 166,
        "unitsUsed": 39,
        "individuals": 182
      }
    },
    "Aug. 19": {
      "cases": {
        "student": 41,
        "employee": 0,
        "total": 41
      },
      "quarantine": {
        "unitsTotal": 166,
        "unitsUsed": 39,
        "individuals": 403
      }
    },
    "Aug. 20": {
      "cases": {
        "student": 92,
        "employee": 2,
        "total": 94
      },
      "quarantine": {
        "unitsTotal": 166,
        "unitsUsed": 82,
        "individuals": 892
      }
    }
  }

function buildCharts(data) {
    console.log(data)

    let rt = []
    let totalCases = []

    let cases = Object.values(data).map(v => v.cases.total)

    cases.forEach((v, i) => {
        if(i == 0) return
        rt.push(Math.round(100 * v / cases[i-1])/100)
    })

    for(let i = 0; i < cases.length; i++) {
        let tot = 0
        for(let j = 0; j <= i; j++) {
            tot += cases[j]
        }
        totalCases.push(tot)
    }

    let newCasesCanvas = document.getElementById('new-cases')
    let ncCtx = newCasesCanvas.getContext('2d');

    let newCasesChart = new Chart(ncCtx, {
        type: 'line',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Total',
                borderColor: 'rgb(255,0,0)',
                fill: false,
                data: Object.values(data).map(v => v.cases.total)
            }, {
                label: 'Student',
                borderColor: 'rgb(220,0,0)',
                fill: false,
                data: Object.values(data).map(v => v.cases.student)
            }, {
                label: 'Employee',
                borderColor: 'rgb(200,0,0)',
                fill: false,
                data: Object.values(data).map(v => v.cases.employee)
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })

    let cCasesCanvas = document.getElementById('cumulative-cases')
    let ccCtx = cCasesCanvas.getContext('2d');

    let cCasesChart = new Chart(ccCtx, {
        type: 'line',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Cases',
                borderColor: 'rgb(255,0,0)',
                fill: false,
                data: totalCases
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })

    let rtCanvas = document.getElementById('rt')
    let rtCtx = rtCanvas.getContext('2d');

    let rtChart = new Chart(rtCtx, {
        type: 'line',
        data: {
            labels: Object.keys(data).slice(1),
            datasets: [{
                label: 'Rt',
                borderColor: 'rgb(255,0,0)',
                fill: false,
                data: rt
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })

    let quarantineCanvas = document.getElementById('quarantine')
    let quarantineCtx = quarantineCanvas.getContext('2d');

    let quarantineChart = new Chart(quarantineCtx, {
        type: 'line',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Available',
                borderColor: 'rgb(255,0,0)',
                fill: false,
                data: Object.values(data).map(v => v.quarantine.unitsTotal)
            }, {
                label: 'Used',
                borderColor: 'rgb(220,0,0)',
                backgroundColor: 'rgba(220,0,0,0.25)',
                data: Object.values(data).map(v => v.quarantine.unitsUsed)
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })

    let iquarantineCanvas = document.getElementById('quarantine-ind')
    let iquarantineCtx = iquarantineCanvas.getContext('2d');

    let iquarantineChart = new Chart(iquarantineCtx, {
        type: 'line',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Individuals',
                borderColor: 'rgb(255,0,0)',
                fill: false,
                data: Object.values(data).map(v => v.quarantine.individuals)
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}

window.onload = () => {
    // buildCharts(placeholderData)
    fetch('https://linode.cobaltrisen.com:3000/data').then(res => res.json()).then(data => {
        buildCharts(data)
    })
}