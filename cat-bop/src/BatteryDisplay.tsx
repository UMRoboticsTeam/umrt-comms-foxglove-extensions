import { Immutable, MessageEvent, PanelExtensionContext, Topic, SettingsTreeAction } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import { set } from "lodash";


import PercentageLevelIndicator from './components/CatImage';


type PercentageState = {
  data: number;
}

type Config = {
  percentageTopic?: string
  threshold?: number
};


function BatteryDisplay({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();
  const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();
  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  // const [batteryMessage, setbatteryMessage] = useState<BatteryState | undefined>();
  const [percentageMessage, setpercentageMessage] = useState<PercentageState | undefined>();

  // Init config variable
  const [config, setConfig] = useState<Config>(() => {
    const partialConfig = context.initialState as Config;

    const {
      percentageTopic = "",
      threshold = 0.5,
    } = partialConfig;

    return { percentageTopic, threshold };
  });

  // Topic types memo (filter topics by type)
  const numberTopics = useMemo(
    () => (topics ?? []).filter((topic) => topic.schemaName === "std_msgs/msg/Float64"),
    [topics],
  );

  const actionHandler = useCallback(
    (action: SettingsTreeAction) => {
      if (action.action === "update") {
        const { path, value } = action.payload;

        // Update config based on the previous config
        setConfig((previous) => {
          const newConfig = { ...previous };
          set(newConfig, path.slice(1), value);
          return newConfig;
        });
      }
    },
    [context],
  );

  // update setting editor when config or topics change
  useEffect(() => {
    context.saveState(config);
    const percentageTopicOptions = (numberTopics ?? []).map((topic) => ({ value: topic.name, label: topic.name }));

    context.updatePanelSettingsEditor({
      actionHandler,
      nodes: {
        general: {
          label: "General",
          icon: "Cube",
          fields: {
            percentageTopic: {
              label: "Number Topic",
              input: "select",
              options: percentageTopicOptions,
              value: config.percentageTopic,
            },
            threshold: {
              label: "Threshold",
              input: "number",
              value: config.threshold,
              step: 0.1,
              min: 0.0,
              max: 1.0,
            }
          },
        },
      },
    });
  }, [context, actionHandler, config, topics]);

  // Subscribe to wanted topics
  useEffect(() => {
    context.saveState({ topic: config });
    let topicsList = [];

    if (config.percentageTopic) {
      topicsList.push({ topic: config.percentageTopic });
    }
    context.subscribe(topicsList);
  }, [context, config]);

  // Main Layout effect
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);

      setMessages(renderState.currentFrame);
      setTopics(renderState.topics);
    };

    context.watch("topics");
    context.watch("currentFrame");

  }, [context]);

  useEffect(() => {
    if (messages) {
      for (const message of messages) {
        // read all incoming messages
        if (message.topic === config.percentageTopic) {
          setpercentageMessage(message.message as PercentageState);
        }
      }
    }
  }, [messages]);

  // invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  return (
    <div>
      <div style={{ padding: "1rem", borderRadius: "0.5rem" }}>
        <PercentageLevelIndicator level={percentageMessage?.data ?? 0} threshold={config.threshold ?? 0}/>
      </div>
    </div>
  );
}

export function initBatteryDisplay(context: PanelExtensionContext): () => void {
  ReactDOM.render(<BatteryDisplay context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
