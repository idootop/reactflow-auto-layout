import './styles.css';

import { Handle, type NodeProps, Position } from '@xyflow/react';
import { type ComponentType, memo } from 'react';

import { kReactflowLayoutConfig } from '@/components/ControlPanel';
import type { ReactflowBaseNode } from '@/data/types';

export const BaseNode: ComponentType<NodeProps<ReactflowBaseNode>> = memo(
  ({ data }) => {
    const { direction, reverseSourceHandles } = kReactflowLayoutConfig.state;
    const isHorizontal = direction === 'horizontal';
    const targetHandlesFlexDirection: any = isHorizontal ? 'column' : 'row';
    const sourceHandlesFlexDirection: any =
      targetHandlesFlexDirection + (reverseSourceHandles ? '-reverse' : '');
    return (
      <>
        <div
          className={`handles handles-${direction} targets`}
          style={{
            flexDirection: targetHandlesFlexDirection,
          }}
        >
          {data.targetHandles.map((id) => (
            <Handle
              className={`handle handle-${direction}`}
              id={id}
              key={id}
              position={isHorizontal ? Position.Left : Position.Top}
              type="target"
            />
          ))}
        </div>
        <div className="label">{data.id}</div>
        <div
          className={`handles handles-${direction} sources`}
          style={{
            flexDirection: sourceHandlesFlexDirection,
          }}
        >
          {data.sourceHandles.map((id) => (
            <Handle
              className={`handle handle-${direction}`}
              id={id}
              key={id}
              position={isHorizontal ? Position.Right : Position.Bottom}
              type="source"
            />
          ))}
        </div>
      </>
    );
  },
);

BaseNode.displayName = 'BaseNode';
