import { Loading } from "@teamfabric/copilot-ui";

 const RenderAppLoader = () => {
  return (
    <div id="app-loader-container"  >
      <Loading className="global app-loader-icon" size={45} />
      <br />
    </div>
  );
};

export default RenderAppLoader;

