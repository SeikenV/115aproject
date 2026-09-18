
const CatSprite = function() {
    const[frame, setFrame] = useState(0);

    const spriteStyle = {
        width: '600px',
        height: '600px',
        backgroundImage: '../../assets/outskirts-assets/SpriteSheetCat.png.PNG', /* URL of your sprite sheet */
        backgroundPosition: '-${frame * 600}px 0px`'
    };
    const animateSprite = () => {
        setFrame((frame + 1) % 4); // Assuming 4 frames in the sprite sheet
      };
    
      // Start the animation when the component mounts
      React.useEffect(() => {
        const interval = setInterval(animateSprite, 1000); // Change the interval according to your animation speed
        return () => clearInterval(interval);
      }, []);
      return (
        <div className = "sprite" style={spriteStyle}></div>
      );
}

export default CatSprite;