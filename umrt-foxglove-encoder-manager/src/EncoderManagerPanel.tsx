// src/EncoderManagerPanel.tsx

// Majority of this is AI, Top Part is most of the Logic, while the Bottom Part is the Aesthetics

import React, { ReactElement, useLayoutEffect, useState } from 'react';
import { createRoot } from "react-dom/client"; // Import createRoot
// import { useServiceCall } from '@foxglove/extension'; // Use @foxglove/extension/hooks
import { PanelExtensionContext } from '@foxglove/extension'; // Use @foxglove/extension for context type

// Define the service type explicitly for better type checking
interface SetBoolRequest { // Renamed from EncoderManagerRequest for consistency with previous srv def
  data: boolean;
}

interface SetBoolResponse { // Renamed from EncoderManagerResponse
  success: boolean;
  message: string;
}

// Renamed and adjusted to accept context as a prop, as expected by initPanel pattern
function EncoderManagerPanel({ context }: { context: PanelExtensionContext }): ReactElement {
  const [feedback, setFeedback] = useState<string>('');
  // State to track the on/off status of each camera's encoder
  const [isRoverEncoderOn, setIsRoverEncoderOn] = useState<boolean>(false);
  const [isArm0EncoderOn, setIsArm0EncoderOn] = useState<boolean>(false);
  const [isArm1EncoderOn, setIsArm1EncoderOn] = useState<boolean>(false);

  const cameraStates = {
    'rover_cam0': { displayName: 'Rover Cam 0', state: isRoverEncoderOn, setter: setIsRoverEncoderOn },
    'arm_cam0': { displayName: 'Arm Cam 0', state: isArm0EncoderOn, setter: setIsArm0EncoderOn },
    'arm_cam1': { displayName: 'Arm Cam 1', state: isArm1EncoderOn, setter: setIsArm1EncoderOn },
  };

  // REMOVED SINCE ITS NOT USED IN API BUT INSTEAD USE callSerivce
  // Hook to call the ROS 2 service
  // const callEncoderService = useServiceCall<EncoderControlRequest, EncoderControlResponse>(
  //   '/encoder_control',
  //   'umrt_ros_msgs/srv/EncoderControl' // NOTE: Assumed EncoderControl.srv, not EncoderManager.srv
  // );

  const handleCommand = async (camera_namespace: string, command_bool: boolean, setCurrentState: (val: boolean) => void) => {
    const command = command_bool ? 'start' : 'stop';
    setFeedback(`Sending ${command} command for ${camera_namespace}...`);
    
    // Assuming success
    setCurrentState(command_bool);

    try {
      if (!context.callService) {
        setFeedback('Error: Service call function not available. Is your ROS 2 connection active?');
        // Revert UI state if service call not possible
        setCurrentState(!command_bool); 
        return;
      }

      // Get Service Name and create the request and response
      const service_name = `/${camera_namespace}/bool`;
      const request: SetBoolRequest = {data: command_bool};
      const response = await context.callService(service_name, request) as SetBoolResponse;

      if (response.success) {
        setFeedback(`${command.charAt(0).toUpperCase() + command.slice(1)}ed ${camera_namespace} encoder successfully: ${response.message}`);
      } else {
        setFeedback(`Failed to ${command} ${camera_namespace} encoder: ${response.message}`);
        // Revert UI state if service call failed
        setCurrentState(!command_bool); 
      }
    } catch (error: any) {
      setFeedback(`Error calling service: ${error.message || String(error)}`);
      console.error('Service call error:', error);
      // Revert UI state on network/service call error
      setCurrentState(!command_bool); 
    }
  };

  // Custom Switch Component (or inline it for simplicity)
  const EncoderToggleSwitch: React.FC<{
    cameraName: string;
    cameraNamespace: string;
    isOn: boolean;
    setIsOn: (val: boolean) => void;
  }> = ({ cameraName, cameraNamespace, isOn, setIsOn }) => {
    const toggleEncoder = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCheckedState = event.target.checked;
      // const command = newCheckedState ? 'start' : 'stop';
      handleCommand(cameraNamespace, newCheckedState, setIsOn);
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <h3 style={{ color: '#555', marginRight: '15px', minWidth: '120px', textAlign: 'right' }}>{cameraName}</h3>
        <label className="switch">
          <input type="checkbox" checked={isOn} onChange={toggleEncoder} />
          <span className="slider round"></span>
        </label>
        <span style={{ marginLeft: '10px', fontWeight: 'bold', color: isOn ? '#4CAF50' : '#f44336' }}>
          {isOn ? 'ON' : 'OFF'}
        </span>
      </div>
    );
  };

  // Implement context watching as per ExamplePanel.tsx
  // This is important for the panel to receive updates or utilize other context features
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      // You can process renderState here if needed (e.g., subscribing to topics, displaying messages)
      // For this panel, we primarily just need the context for service calls,
      // but keeping the render callback structure is good practice for the template.
      if (renderState) {
        
      }
      done(); // IMPORTANT: Must call done() to indicate rendering is complete
    };
    // If your panel needs to react to other data (topics, parameters),
    // you would add context.watch("topics") or context.watch("currentFrame") etc.
    // For a service-only panel, watching isn't strictly necessary for rendering itself,
    // but the `onRender` callback is part of the `initPanel` contract.
  }, [context]);

  //  TOP
  //  --------------------------
  //  BOTTOM

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <style>{`
        /* The switch - the box around the slider */
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        /* Hide default HTML checkbox */
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        /* The slider */
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 34px; /* Makes it rounded */
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 50%; /* Makes the circle */
        }

        input:checked + .slider {
          background-color: #4CAF50; /* Green when checked */
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #4CAF50;
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }
      `}</style>

      <h2 style={{ color: '#333', marginBottom: '20px' }}>Encoder Control</h2>
      
      {/* Refactor to use the cameraStates object for cleaner rendering and to use the variable */}
      {Object.entries(cameraStates).map(([namespace, { displayName, state, setter }]) => (
        <EncoderToggleSwitch
          key={namespace} // Use namespace as key for React lists
          cameraName={displayName}
          cameraNamespace={namespace}
          isOn={state}
          setIsOn={setter}
        />
      ))}

      {feedback && (
        <p style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', backgroundColor: '#e0f7fa', color: '#00796b', border: '1px solid #b2ebf2' }}>
          {feedback}
        </p>
      )}
    </div>
  );
}

// This is the function that the Foxglove extension system calls to initialize your panel
export function initEncoderManagerPanel(context: PanelExtensionContext): () => void {
  const root = createRoot(context.panelElement);
  root.render(<EncoderManagerPanel context={context} />);

  // Return a cleanup function to run when the panel is removed
  return () => {
    root.unmount();
  };
}
