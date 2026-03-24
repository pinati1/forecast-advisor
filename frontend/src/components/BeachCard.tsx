interface Beach {
    _id: string;
    name: string;
    distance?: number;
    condition?: string; 
  }
  
  interface BeachCardProps {
    beach: Beach;
  }
  
  export default function BeachCard({ beach }: BeachCardProps) {
    return (
      <div className="beach-card">
        <h2>{beach.name}</h2>
        {beach.distance && (
          <p>Distance: {beach.distance.toFixed(2)} km away</p>
        )}
        {beach.condition && (
          <div className="condition-badge">
            Condition: {beach.condition}
          </div>
        )}
      </div>
    );
  }