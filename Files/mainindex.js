const countries = document.querySelector('datalist');
const search = document.querySelector('#srch');
const date = document.querySelector('#date');
const countryName = document.querySelector('#country-name');
const confirmed = document.querySelector('.confirmed');
const deaths = document.querySelector('.deaths');
const recovered = document.querySelector('.recovered');
const chart = document.querySelector('.chart');

let datachart = [];

const API_URL = "https://api.covid19api.com/summary";

async function covid(country)
{
    countries.innerHTML = `<option id="world">World</option>`;
    resetValue(confirmed);
    resetValue(deaths);
    resetValue(recovered);
    const res = await fetch(API_URL);
    //console.log(res);
    const data = await res.json();
    console.log(country);

    if(res.status === 4 || res.status === 200)
    {
    date.textContent = new Date(data.Date).toDateString();
        
        if(country === '' || country === 'world')
        {
            const {TotalConfirmed,TotalDeaths,TotalRecovered,NewConfirmed,NewDeaths,NewRecovered} = data.Global;
            
            total(TotalConfirmed, TotalDeaths, TotalRecovered);
            newUpdate(NewConfirmed, NewDeaths, NewRecovered);

            countryName.textContent = 'World';

            datachart = [TotalConfirmed, TotalDeaths, TotalRecovered];
        };
        

        data.Countries.forEach(item =>{
            const option = document.createElement('option');
            option.value = item.Country;
            option.textContent = item.Country;
            countries.appendChild(option);

            if(country === item.Country)
            {
                total(item.TotalConfirmed, item.TotalDeaths, item.TotalRecovered);
                newUpdate(item.NewConfirmed, item.NewDeaths, item.NewRecovered);
                
                countryName.textContent = item.Country;

                datachart = [item.TotalConfirmed, item.TotalDeaths, item.TotalRecovered];
            }
        });

        drawChart(datachart);
    }
    else
    {
        chart.innerHTML = `<h2>Loading.........</h2>`;
    }
}

const speed = 100;

function counting(target, element)
{
    const inc = target / speed;
     //console.log(typeof(inc))
    const count = +element.textContent;
    console.log(typeof(count))

    if(count < target)
    {
        element.textContent = Math.ceil(count + inc);
        setTimeout(()=>{
            counting(target, element);
        },1)
    }
    else{
        element.textContent = target;
    }
};

function total(Confirmed, Deaths, Recovered)
{
    // Total Confirmed
    counting(Confirmed, confirmed.children[1]);
    
     // Total Deaths
     counting(Deaths, deaths.children[1]); 
    
     // Total Recovred
     counting(Recovered, recovered.children[1]); 
     
};

function newUpdate(Confirmed, Deaths, Recovered)
{
     
     // New Confirmed
     counting(Confirmed, confirmed.children[2]);

     // New Deaths
     counting(Deaths, deaths.children[2]);

     // New Recovered
     counting(Recovered, recovered.children[2]);
};


function resetValue(element)
{
    element.children[1].textContent = 0;
    element.children[2].textContent = 0;
};

function drawChart(data)
{
    chart.innerHTML='';    // chart length type;
    const ctx =document.createElement('canvas');
    chart.appendChild(ctx);
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Confirmed', 'Total Deaths', 'Total Recovered'],
            datasets: [{
                label: countryName.textContent,
                data: data,
                backgroundColor: ['crimson','black','green'],
                /*borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1*/
            }]
        },
        options: {}
    });
};

covid(search.value);

const btnSearch = document.querySelector('button');
btnSearch.addEventListener('click', (e)=>{
    e.preventDefault();
    covid(search.value);
    //console.log(search.value);
    search.value = '';
});