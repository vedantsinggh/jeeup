import React from 'react';
import './AboutPage.css'; // Make sure to include your CSS

function AboutPage() {
    const team = [
        {
            name: 'Niza Garg',
            role: 'CEO',
            img: 'https://images.pexels.com/photos/90764/man-studio-portrait-light-90764.jpeg',
            description: 'John is the visionary behind our company, leading us with innovation and passion.',
        },
        {
            name: 'Aishwary Singh',
            role: 'CTO',
            img: 'https://images.pexels.com/photos/90764/man-studio-portrait-light-90764.jpeg',
            description: 'Jane is the tech genius, always pushing boundaries with cutting-edge technologies.',
        },
        {
            name: 'Mike Johnson',
            role: 'CFO',
            img: 'https://images.pexels.com/photos/90764/man-studio-portrait-light-90764.jpeg',
            description: 'Mike ensures our financial health and long-term success with his strategic thinking.',
        },
    ];

    return (
        <>
        <header>
        <h1>JEEUP</h1>
        <nav>
          <ul>
            <li><a href="/">Back</a></li>
          </ul>
        </nav>
      </header>

        <div className="about-section">
            <h2 className="about-title">Meet Our Team</h2>
            <div className="card-container">
                {team.map((member, index) => (
                    <div key={index} className="card">
                        <img src={member.img} alt={`${member.name} image`} />
                        <h3>{member.name}</h3>
                        <h4>{member.role}</h4>
                        <p>{member.description}</p>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default AboutPage;
