import { Component, h, cloneElement } from "preact";
import { outlineSuppressionHandlers } from "services/a11y";
import { isIOS } from "services/browsers";

interface DraggableProps {
  x?: number,
  y?: number,
  updatePosition?: (x: number, y: number) => void
}

interface DraggableState {
  dragging: boolean,
  rel: { x: number, y: number },
  pos: { x: number, y: number },
  beingDragged: boolean,
  wasMoved: boolean
}

interface TouchEventItem {
  pageX: number,
  pageY: number
}

export default class Draggable extends Component<DraggableProps, DraggableState> {
  static defaultProps = {
    x: 0,
    y: 0
  };
  myRef: any;

  constructor(props: DraggableProps) {
    super(props);

    const { x, y } = props;

    this.state = {
      pos: { x, y },
      dragging: false,
      rel: null,
      beingDragged: false,
      wasMoved: false
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onUp = this.onUp.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidUpdate(prevProps: DraggableProps, prevState: DraggableState) {
    const { dragging, beingDragged } = this.state;
    if (dragging && !prevState.dragging) {
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onUp);
      document.addEventListener("touchmove", this.onTouchMove, { passive: false });
      document.addEventListener("touchend", this.onUp);
    } else if (!dragging && prevState.dragging) {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onUp);
      document.removeEventListener("touchmove", this.onTouchMove);
      document.removeEventListener("touchend", this.onUp);
    }

    if (beingDragged) {
      document.addEventListener("click", this.handleOnClick, true);
    } else {
      document.removeEventListener("click", this.handleOnClick, true);
    }
  }

  delayedSetter() {
    setTimeout(
      (() => {
        this.setState({ beingDragged: false });
        document.removeEventListener("click", this.handleOnClick, true);
      })
      .bind(this),
      50
    );
  }

  handleOnClick(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseDown(e: MouseEvent) {
    // only left mouse button
    if (e.button !== 0) return;
    const pos = this.myRef.getBoundingClientRect();
    this.onDragSelection(e);
    e.stopPropagation();
    e.preventDefault();
  }

  onTouchStart(e: TouchEvent) {
    // only when an item is touched
    if (e.changedTouches.length !== 1) return;
    const item = e.changedTouches[0];
    this.onDragSelection(item);
    e.stopPropagation();

    // Fix iOS issues where pages scrolls while dragging
    if (isIOS()) {
      e.preventDefault();
    }
  }

  onDragSelection(e: MouseEvent | TouchEventItem) {
    const pos = this.myRef.getBoundingClientRect();
    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - pos.right,
        y: e.pageY - pos.bottom
      }
    });
  }

  onUp(e: MouseEvent | TouchEvent) {
    const { wasMoved } = this.state;
    this.setState({ dragging: false, wasMoved: false },
        () => this.delayedSetter()
      );
    e.stopPropagation();

    // Fix iOS issue where button is inaccessible after dragging
    if (!wasMoved && isIOS()) {
      e.target.dispatchEvent(new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }
  }

  onMouseMove(e: MouseEvent) {
    this.onMove(e);
    e.stopPropagation();
    e.preventDefault();
  }

  onTouchMove(e: TouchEvent) {
    // only when an item is touched
    if (e.changedTouches.length !== 1) return;
    const item = e.changedTouches[0];
    this.onMove(item);
    e.stopPropagation();
    e.preventDefault();
  }

  onMove(e: MouseEvent | TouchEventItem) {
    const { dragging, rel } = this.state;
    if (!dragging) return;
    const { updatePosition } = this.props;
    const x = Math.max(window.innerWidth - e.pageX + rel.x, 0);
    const y = Math.max(window.innerHeight - e.pageY + rel.y, 0);

    this.setState({
      pos: { x, y },
      beingDragged: true,
      wasMoved: true
    });

    if (updatePosition) {
      updatePosition(x, y);
    }
  }

  render() {
    const { pos } = this.state;
    const { children } = this.props;
    const divStyle = {
      position: "fixed",
      right: `${pos.x}px`,
      bottom: `${pos.y}px`
    };

    // Because Preact children is defined so oddly -_-
    const numChildren = Object.keys(children).length;
    const newChildren = [];
    let i: number;
    for (i = 0; i < numChildren; i = i + 1) {
      if (children[i]) {
        newChildren.push(cloneElement(children[i],
          { dragPosition: pos, ...outlineSuppressionHandlers }));
      }
    }

    return(
      <div
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
        style={divStyle}
        ref={c => this.myRef = c}
        role="presentation"
      >
        {newChildren}
      </div>
    );
  }
}

export const draggability = ({ isDraggable, updatePosition, x, y, children }) => (isDraggable ?
  (
    <Draggable updatePosition={updatePosition} x={x} y={y}>
      {children}
    </Draggable>
  )
  : <div>{children}</div>
);
