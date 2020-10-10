import '../src/index.scss';
import Button from 'muicss/lib/react/button';
import {faDiscord} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandPeace} from '@fortawesome/free-regular-svg-icons';

export default function Home() {
  return (
    <>
      <div className="trianglify">
        <div className="trianglify__overlay"/>
        <div className="trianglify__content p-3 d-flex align-items-center justify-content-center">
          <div>
            <h1 className="jumbo mb-1">Boutique Discord Bots</h1>
            <p className="lead ml-1 mb-2">Run the server we all want to be in</p>
            <Button className="m-1" color="accent" variant="raised">
              <FontAwesomeIcon style={{verticalAlign: 'middle'}} size="lg" className="mr-1" icon={faDiscord}/> Add to Discord
            </Button>
            <Button color="primary" variant="flat" size="lg">Learn More</Button>
          </div>
        </div>
      </div>
      <h4 className="text-center mt-5"><a href="/" className="color-string">'boyo.gg'</a> <FontAwesomeIcon className="color-string" icon={faHandPeace}/></h4>
      <div className="d-flex justify-content-center pb-5">
        <div className="color-bg-darker p-3 mui--z3 key-streak" style={{minWidth: '40%', maxWidth: '800px'}}>
          <h1>Entering Open Alpha</h1>
          <p>A suite of tools built for game server admins and PC gaming enthusiasts. Boyo.gg tries to provide tools community leaders can use to create the best possible experience for themselves and their members.</p>
          <p>Starting with a focus on console DayZ, boyo.gg will provide;</p>
          <ul>
            <li>Configurable server maintenance commands for restarts, bans and unbans.</li>
            <li>Automated anti-grief protection for easy enforcement of raiding rules.</li>
            <li>Server logs pumped into discord with iZurvive links for efficient monitoring.</li>
            <li>Activity feed for PvP and building events.</li>
            <li>Management of server xml configuration via Discord file uploads.</li>
            <li>King of the Hill: a new dimension of DayZ PvP based land control.</li>
            <li>...and much more</li>
          </ul>
          <p><a href="">Join the pilot server</a></p>
        </div>
      </div>
    </>
  );
}
