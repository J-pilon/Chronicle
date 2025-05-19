import PieChart, {
  Series,
  Label,
  Size,
  Export
} from 'devextreme-react/pie-chart';

export default function PieGraph(props: {data: [{mood: number | string, entires: string | number}], startDate: Date | null, endDate: Date | null}) {
  const { data } = props;

  const legendClickHandler = (event: any) => {
    const arg = event.target;
    const item = event.component.getAllSeries()[0].getPointsByArg(arg)[0];

    toggleVisibility(item);
  }

  const toggleVisibility = (item: any) => {
    item.isVisible() ? item.hide() : item.show();
  }

  return (
    <PieChart
    id="pie"
    dataSource={data}
    palette="Bright"
    title="Your Cumulative Mood Over Time"
    onPointClick={(event) => {toggleVisibility(event.target)}}
    onLegendClick={(event) => {legendClickHandler(event)}}
  >
    <Series
      argumentField="mood"
      valueField="entries"
    >
      <Label visible={true}>
      </Label>
    </Series>

    <Size width={700} />
    <Export enabled={false} />
  </PieChart>
  );
}