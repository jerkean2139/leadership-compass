import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Result, Direction } from '../types';
import { descriptions } from '../data/descriptions';

// Helper function to create PDF from HTML element
export const generatePDFFromElement = async (element: HTMLElement, fileName: string): Promise<void> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  
  pdf.save(fileName);
};

// Helper function to generate a chart visualization for PDF
const generateChartVisualization = (percentages: Record<Direction, number>): string => {
  const colors = {
    north: '#FF5757', // Red
    east: '#FFD166',  // Yellow
    south: '#06D6A0', // Green
    west: '#118AB2',  // Blue
  };

  const maxValue = 100; // Max percentage value
  const chartSize = 200; // Size of the chart in pixels
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const maxRadius = chartSize * 0.45; // Leave some margin

  // Create quadrant labels
  const labels = {
    north: 'Summit Seeker',
    east: 'Horizon Hunter',
    south: 'Valley Guardian',
    west: 'Forest Sage'
  };

  const generatePath = (direction: Direction, percentage: number): string => {
    const angle = direction === 'north' ? 0 : 
                  direction === 'east' ? 90 : 
                  direction === 'south' ? 180 : 270;
    
    const startAngle = ((angle - 45) * Math.PI) / 180;
    const endAngle = ((angle + 45) * Math.PI) / 180;
    
    const radius = (percentage / maxValue) * maxRadius;
    
    const startX = centerX + radius * Math.sin(startAngle);
    const startY = centerY - radius * Math.cos(startAngle);
    const endX = centerX + radius * Math.sin(endAngle);
    const endY = centerY - radius * Math.cos(endAngle);
    
    return `
      <path d="M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} Z" 
        fill="${colors[direction]}" stroke="#333" stroke-width="1" />
    `;
  };

  return `
    <div style="display: flex; justify-content: center; margin: 20px 0;">
      <div style="position: relative; width: ${chartSize}px; height: ${chartSize}px;">
        <svg width="${chartSize}" height="${chartSize}" viewBox="0 0 ${chartSize} ${chartSize}">
          ${generatePath('north', percentages.north)}
          ${generatePath('east', percentages.east)}
          ${generatePath('south', percentages.south)}
          ${generatePath('west', percentages.west)}
          <circle cx="${centerX}" cy="${centerY}" r="2" fill="#333" />
        </svg>
        
        <!-- Labels -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
          <div style="position: absolute; top: 5px; left: 50%; transform: translateX(-50%); text-align: center;">
            <div style="font-weight: bold; color: ${colors.north};">${labels.north}</div>
            <div style="font-size: 12px;">${percentages.north.toFixed(0)}%</div>
          </div>
          <div style="position: absolute; top: 50%; right: 5px; transform: translateY(-50%); text-align: center;">
            <div style="font-weight: bold; color: ${colors.east};">${labels.east}</div>
            <div style="font-size: 12px;">${percentages.east.toFixed(0)}%</div>
          </div>
          <div style="position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); text-align: center;">
            <div style="font-weight: bold; color: ${colors.south};">${labels.south}</div>
            <div style="font-size: 12px;">${percentages.south.toFixed(0)}%</div>
          </div>
          <div style="position: absolute; top: 50%; left: 5px; transform: translateY(-50%); text-align: center;">
            <div style="font-weight: bold; color: ${colors.west};">${labels.west}</div>
            <div style="font-size: 12px;">${percentages.west.toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Generate User-Focused PDF Content
export const generateUserReport = (result: Result): string => {
  const { primary, secondary, percentages } = result;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(to right, #2E2A5E, #4CC9F0); padding: 20px; color: white; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">Your Leadership Compass</h1>
        <p style="margin-top: 10px; font-size: 16px;">Your Personal Leadership Journey Map</p>
      </div>
      
      ${generateChartVisualization(percentages)}
      
      <div style="display: flex; margin-bottom: 30px; gap: 20px;">
        <div style="flex: 1; background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Your Primary Direction: ${descriptions[primary].title}</h2>
          <p style="font-style: italic;">
            Like a ${primary === 'north' ? 'summit seeker' : primary === 'east' ? 'horizon hunter' : primary === 'south' ? 'valley guardian' : 'forest sage'} 
            on a wilderness journey, your leadership naturally flows toward ${descriptions[primary].traits[0].toLowerCase()} 
            and ${descriptions[primary].traits[1].toLowerCase()}.
          </p>
          <h3 style="color: #4CC9F0; font-size: 16px;">Natural Strengths:</h3>
          <ul>
            ${descriptions[primary].strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        
        <div style="flex: 1; background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Your Secondary Direction: ${descriptions[secondary].title}</h2>
          <p style="font-style: italic;">
            Your secondary direction adds valuable depth to your leadership approach, much like how a skilled 
            ${secondary === 'north' ? 'mountaineer' : secondary === 'east' ? 'explorer' : secondary === 'south' ? 'guide' : 'tracker'} 
            can adapt to changing terrain.
          </p>
          <h3 style="color: #4CC9F0; font-size: 16px;">Complementary Strengths:</h3>
          <ul>
            ${descriptions[secondary].strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Your Leadership Terrain Map</h2>
        <p>
          Your journey combines the strengths of ${descriptions[primary].title} (${percentages[primary].toFixed(0)}%) 
          and ${descriptions[secondary].title} (${percentages[secondary].toFixed(0)}%), creating a unique path 
          that distinguishes your leadership approach. Like a well-marked trail through diverse landscapes, 
          your leadership style offers distinct advantages and perspectives.
        </p>
        <p>
          When the path ahead is clear, your ${primary} tendencies will serve you well. 
          When new challenges arise, your ${secondary} qualities provide additional resources.
        </p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Your Growth Path</h2>
        <p>
          Every trail has areas that can be challenging. As you continue your leadership journey, 
          consider exploring these potential growth areas:
        </p>
        <ul>
          ${descriptions[primary].challenges.map(c => `<li>${c}</li>`).join('')}
        </ul>
        <p>
          Like a skilled wilderness guide, the most effective leaders know how to balance their strengths 
          and address their blind spots. Consider incorporating practices that help you develop in your 
          less dominant directions.
        </p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Critical Thinking & Problem-Solving</h2>
        <p>
          Based on your assessment, here's how you approach complex challenges:
        </p>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Problem Analysis</h3>
          <p>
            You tend to ${primary === 'north' ? 'quickly identify the core issues that need to be addressed' : 
              primary === 'east' ? 'look for patterns and connections that others might miss' : 
              primary === 'south' ? 'consider how problems affect people and relationships' : 
              'thoroughly investigate all aspects before proceeding'}.
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Decision-Making</h3>
          <p>
            When making decisions, you typically ${primary === 'north' ? 'focus on efficiency and results' : 
              primary === 'east' ? 'explore creative solutions and possibilities' : 
              primary === 'south' ? 'consider the impact on team harmony and morale' : 
              'analyze risks and follow established procedures'}.
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Learning Style</h3>
          <p>
            You learn best through ${primary === 'north' ? 'action and practical application' : 
              primary === 'east' ? 'exploration and innovation' : 
              primary === 'south' ? 'collaboration and discussion' : 
              'structured study and analysis'}.
          </p>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Career Orientation & Passion</h2>
        <p>
          Your assessment indicates these key insights about your career approach:
        </p>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">What Energizes You</h3>
          <p>
            You are most energized by ${primary === 'north' ? 'achieving milestones and seeing tangible progress' : 
              primary === 'east' ? 'discovering new approaches and possibilities' : 
              primary === 'south' ? 'making meaningful connections and helping others grow' : 
              'mastering complex systems and improving processes'}.
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Professional Development</h3>
          <p>
            Your approach to growth focuses on ${primary === 'north' ? 'skills that will help you advance to leadership positions' : 
              primary === 'east' ? 'exploring emerging trends and innovative approaches' : 
              primary === 'south' ? 'deepening relationships and collaboration skills' : 
              'methodically building expertise in your specific domain'}.
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Long-term Vision</h3>
          <p>
            In the long run, you aspire to be known for ${primary === 'north' ? 'delivering exceptional results and driving success' : 
              primary === 'east' ? 'pioneering innovative approaches and inspiring change' : 
              primary === 'south' ? 'building strong teams and developing others' : 
              'creating reliable systems and maintaining high standards'}.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #ddd;">
        <p style="font-style: italic; color: #666;">
          This leadership assessment is designed to highlight your natural strengths and tendencies.
          Remember that all directions of the leadership compass are valuable, and the most effective
          leaders can adapt their approach based on what each situation requires.
        </p>
      </div>
    </div>
  `;
};

// Generate Manager-Focused PDF Content
export const generateManagerReport = (result: Result): string => {
  const { primary, secondary, percentages } = result;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(to right, #2E2A5E, #4CC9F0); padding: 20px; color: white; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">Leadership Compass: Manager Report</h1>
        <p style="margin-top: 10px; font-size: 16px;">Guide for Supporting This Team Member's Leadership Journey</p>
      </div>
      
      ${generateChartVisualization(percentages)}
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Leadership Style Overview</h2>
        <p>
          This team member's leadership compass indicates a ${primary} primary direction 
          (${percentages[primary].toFixed(0)}%) with a ${secondary} secondary direction 
          (${percentages[secondary].toFixed(0)}%).
        </p>
        <p>
          Think of them as a ${primary === 'north' ? 'Summit Seeker' : 
              primary === 'east' ? 'Horizon Hunter' : 
              primary === 'south' ? 'Valley Guardian' : 
              'Forest Sage'} who also draws strength from the 
          ${secondary === 'north' ? 'Summit Seeker' : 
              secondary === 'east' ? 'Horizon Hunter' : 
              secondary === 'south' ? 'Valley Guardian' : 
              'Forest Sage'} approach.
        </p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Strengths to Leverage</h2>
        <p>
          This team member naturally excels in these areas:
        </p>
        <ul>
          ${descriptions[primary].strengths.map(s => `<li><strong>${s}</strong></li>`).join('')}
        </ul>
        <p>They also bring these complementary strengths:</p>
        <ul>
          ${descriptions[secondary].strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Potential Blind Spots</h2>
        <p>
          Be aware of these potential challenges based on their ${primary} orientation:
        </p>
        <ul>
          ${descriptions[primary].challenges.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Management Approach</h2>
        <p>
          Consider these strategies when working with this team member:
        </p>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Communication</h3>
          <p>
            ${primary === 'north' 
              ? 'Be direct and to the point. Focus on results and objectives. Avoid unnecessary details or lengthy explanations.' 
              : primary === 'east' 
              ? 'Allow room for brainstorming and idea sharing. Be open to their innovative perspectives and don\'t shut down creative suggestions too quickly.' 
              : primary === 'south' 
              ? 'Take time for personal connection. Acknowledge their feelings and perspectives. Create a safe space for open dialogue.' 
              : 'Provide detailed information and logical rationales. Be prepared with facts and data to support your points.'}
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Delegation</h3>
          <p>
            ${primary === 'north' 
              ? 'Focus on what needs to be accomplished, not how to do it. Provide clear objectives and key constraints, then give them autonomy.' 
              : primary === 'east' 
              ? 'Provide flexibility in how tasks are approached. Allow room for creativity and innovation in the process.' 
              : primary === 'south' 
              ? 'Emphasize the purpose and impact of the work on others. Create opportunities for collaboration and teamwork.' 
              : 'Provide clear expectations, guidelines, and resources. Be specific about deliverables and quality standards.'}
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Feedback</h3>
          <p>
            ${primary === 'north' 
              ? 'Be straightforward and results-focused. Highlight achievements and areas for improvement directly.' 
              : primary === 'east' 
              ? 'Recognize their innovative ideas. Frame improvement areas as opportunities for creative problem-solving.' 
              : primary === 'south' 
              ? 'Deliver feedback in a supportive manner. Acknowledge their contributions to team harmony and relationships.' 
              : 'Provide specific, detailed observations. Use concrete examples and logical reasoning.'}
          </p>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Critical Thinking & Problem-Solving Assessment</h2>
        <p>
          Understanding how this team member approaches complex problems:
        </p>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Analytical Approach</h3>
          <p>
            ${primary === 'north' 
              ? 'They tend to cut through complexity by focusing on the core issues and making decisive judgments. While effective for prompt resolution, they may sometimes oversimplify nuanced problems.' 
              : primary === 'east' 
              ? 'Their strength lies in identifying patterns and making connections that others miss. They excel at creative problem-solving but may sometimes pursue interesting tangents at the expense of practical solutions.' 
              : primary === 'south' 
              ? 'They excel at understanding the human dimensions of problems and building consensus. Their collaborative approach yields buy-in but may sometimes prioritize harmony over confronting difficult issues.' 
              : 'They methodically analyze problems, breaking them down into manageable components. Their thorough approach catches details others miss, though they may sometimes get caught in analysis paralysis.'}
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Decision-Making</h3>
          <p>
            ${primary === 'north' 
              ? 'They make decisions swiftly and with confidence. Provide them with clear objectives and key constraints, but avoid micromanaging their approach.' 
              : primary === 'east' 
              ? 'They consider novel approaches and generate multiple options. Give them space to explore possibilities, but help them establish criteria for final decisions.' 
              : primary === 'south' 
              ? 'They prioritize inclusive decisions that honor relationships. Support them in setting appropriate boundaries when tough calls must be made despite potential discord.' 
              : 'They make carefully considered decisions based on thorough analysis. Help them establish timelines to prevent analysis paralysis.'}
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Development Opportunities</h3>
          <p>
            To enhance their critical thinking capabilities, encourage them to:
          </p>
          <ul>
            ${primary === 'north' 
              ? '<li>Take time to consider secondary impacts of decisions</li><li>Deliberately seek input from diverse stakeholders</li><li>Practice articulating the reasoning behind their conclusions</li>' 
              : primary === 'east' 
              ? '<li>Implement practical evaluation criteria for their ideas</li><li>Develop systematic approaches to implementation</li><li>Practice prioritizing ideas based on resource constraints</li>' 
              : primary === 'south' 
              ? '<li>Practice making decisions without universal consensus</li><li>Develop comfort with productive conflict</li><li>Balance empathy with objective analysis of situations</li>' 
              : '<li>Set time limits for research and analysis phases</li><li>Practice making decisions with incomplete information</li><li>Start with rough prototypes rather than perfected solutions</li>'}
          </ul>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Autonomy & Guidance Assessment</h2>
        <p>
          Insights on this team member's need for direction versus independence:
        </p>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Preferred Working Style</h3>
          <p>
            ${primary === 'north' 
              ? 'This team member thrives with clear objectives and significant autonomy. They prefer minimal supervision and appreciate being trusted to deliver results their way.' 
              : primary === 'east' 
              ? 'They work best with general direction and creative freedom. Excessive structure or micromanagement will significantly diminish their effectiveness and engagement.' 
              : primary === 'south' 
              ? 'They value collaborative planning and regular check-ins, not because they need close supervision, but because they value alignment and shared understanding.' 
              : 'They appreciate clear guidelines and expectations. Their independence grows as they master systems and processes, allowing them to work autonomously within established frameworks.'}
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Recommended Management Approach</h3>
          <p>
            Based on their assessment:
          </p>
          <ul>
            ${primary === 'north' 
              ? '<li><strong>DO</strong>: Focus on what needs to be accomplished rather than how</li><li><strong>DO</strong>: Set clear expectations for outcomes and deadlines</li><li><strong>AVOID</strong>: Frequent check-ins or detailed process instructions</li>' 
              : primary === 'east' 
              ? '<li><strong>DO</strong>: Provide context and big-picture goals</li><li><strong>DO</strong>: Allow room to experiment and iterate</li><li><strong>AVOID</strong>: Rigid procedures and excessive structure</li>' 
              : primary === 'south' 
              ? '<li><strong>DO</strong>: Schedule regular but meaningful check-ins</li><li><strong>DO</strong>: Explain the "why" behind initiatives</li><li><strong>AVOID</strong>: Mistaking their desire for collaboration as dependence</li>' 
              : '<li><strong>DO</strong>: Provide detailed initial instruction and clear parameters</li><li><strong>DO</strong>: Recognize their growing mastery with increasing autonomy</li><li><strong>AVOID</strong>: Ambiguous directions or shifting expectations</li>'}
          </ul>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h2 style="color: #2E2A5E; font-size: 20px; margin-top: 0;">Career Development & Passion</h2>
        <p>
          Understanding what drives this team member professionally:
        </p>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Sources of Energy & Motivation</h3>
          <p>
            This team member is most energized by ${primary === 'north' 
              ? 'achieving tangible results and reaching milestones. They thrive on forward momentum and measurable progress.' 
              : primary === 'east' 
              ? 'exploring new possibilities and discovering innovative approaches. They are motivated by freedom to experiment and create.' 
              : primary === 'south' 
              ? 'building meaningful connections and helping others develop. They find purpose in creating supportive environments.' 
              : 'mastering complex systems and improving processes. They take pride in creating reliable frameworks and delivering quality.'} 
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 15px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Career Orientation</h3>
          <p>
            Their assessment suggests they view their work as ${primary === 'north' || primary === 'east' 
              ? 'a <strong>career path</strong> they are actively developing. They likely have specific professional goals and aspirations for advancement.' 
              : 'a <strong>meaningful vocation</strong> aligned with their values and interests. Their commitment extends beyond basic job requirements.'}
          </p>
          <p>
            They are likely to stay engaged when they can ${primary === 'north' 
              ? 'see a clear advancement path and receive recognition for achievements.' 
              : primary === 'east' 
              ? 'exercise creative freedom and contribute innovative approaches.' 
              : primary === 'south' 
              ? 'connect their work to meaningful purpose and positive impact on others.' 
              : 'deepen their expertise and maintain high standards of quality.'}
          </p>
        </div>
        <div style="padding: 15px; background-color: #e9ecef; border-radius: 5px;">
          <h3 style="color: #4CC9F0; font-size: 16px; margin-top: 0;">Development Recommendations</h3>
          <p>
            To support their professional growth and maintain engagement:
          </p>
          <ul>
            ${primary === 'north' 
              ? '<li>Provide clear metrics for success and advancement opportunities</li><li>Recognize achievements publicly and offer increasing challenges</li><li>Discuss career aspirations and create development plans with concrete milestones</li>' 
              : primary === 'east' 
              ? '<li>Create opportunities to pitch and implement new ideas</li><li>Support continuous learning about emerging trends</li><li>Allow them to periodically reinvent aspects of their role</li>' 
              : primary === 'south' 
              ? '<li>Connect their work to organizational purpose and impact on others</li><li>Provide opportunities to mentor and develop team members</li><li>Recognize their contributions to team culture and morale</li>' 
              : '<li>Offer opportunities to deepen specialized knowledge</li><li>Recognize quality and attention to detail</li><li>Provide time for mastering new skills and refining processes</li>'}
          </ul>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #ddd;">
        <p style="font-style: italic; color: #666;">
          This leadership assessment is designed to provide guidance for effective management and development.
          Remember that each leadership style brings valuable strengths to your team, and the most successful
          organizations leverage the diverse approaches of their members.
        </p>
      </div>
    </div>
  `;
};
