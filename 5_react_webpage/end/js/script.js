const imgsList = [
    "img/portfolio1.jpg",
    "img/portfolio2.jpg",
    "img/portfolio3.jpg"
];

const App = ({imgs}) => (
    <div>
        {imgs.map((img, i) =>
            <div className="slide" key={i}><img src={img} /></div>
    )}
    </div>
)

ReactDOM.render(
    <App imgs={imgsList}/>, 
    document.getElementById("react-root")
);