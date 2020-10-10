import '../src/index.scss';
import Button from 'muicss/lib/react/button';

export default function Home() {
  return (
    <div className="trianglify">
      <div className="trianglify__overlay"/>
      <div className="trianglify__content p-3 d-flex align-items-center justify-content-center">
        <div>
          <h1 className="jumbo">Boutique Discord Bots</h1>
          <p className="lead ml-1 mb-2">Run the server we all want to be in</p>
          <Button className="m-1" color="accent" variant="raised">Add to Discord</Button>
        </div>
      </div>
    </div>
  );
}
