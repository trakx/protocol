import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import DerivativeList from "./DerivativeList";
import ContractDetails from "./ContractDetails";
import CreateContractModal from "./CreateContractModal";

import AddressWhitelist from "../contracts/AddressWhitelist.json";

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto"
  },
  tableContainer: {
    height: "flex"
  },
  title: {
    flexGrow: 1
  }
});

class Dashboard extends React.Component {
  state = {
    contractDetailsOpen: false,
    openModalContractAddress: null,
    createContractOpen: false,
    isCreateDisabled: true
  };

  handleDetailsModalOpen = address => {
    this.setState({ contractDetailsOpen: true, openModalContractAddress: address });
  };

  handleDetailsModalClose = () => {
    this.setState({ contractDetailsOpen: false });
  };

  handleCreateModalOpen = () => {
    this.setState({ createContractOpen: true });
  };

  handleCreateModalClose = () => {
    this.setState({ createContractOpen: false });
  };

  componentDidMount() {
    this.verifySponsorEligible();
  }

  verifySponsorEligible() {
    // Get TokenizedDerivativeCreator's sponsorWhitelist address
    const { drizzle } = this.props;
    const { TokenizedDerivativeCreator } = drizzle.contracts;
    const sponsorWhitelistKey = TokenizedDerivativeCreator.methods.sponsorWhitelist.cacheCall();
    let contractAdded = false;

    const unsubscribe = drizzle.store.subscribe(() => {
      const state = drizzle.store.getState();

      const { TokenizedDerivativeCreator } = state.contracts;
      const sponsorWhitelist = TokenizedDerivativeCreator.sponsorWhitelist[sponsorWhitelistKey];
      if (sponsorWhitelist == null) {
        return;
      }

      const account = state.accounts[0];

      // Add the sponsorWhitelist contract. Use a flag to prevent recursive calls.
      if (!contractAdded) {
        contractAdded = true;
        this.setState({ whitelistAddress: sponsorWhitelist.value });
        drizzle.addContract({
          contractName: this.state.whitelistAddress,
          web3Contract: new drizzle.web3.eth.Contract(AddressWhitelist.abi, this.state.whitelistAddress)
        });
      }

      if (drizzle.contracts[this.state.whitelistAddress] == null) {
        return;
      }

      unsubscribe();

      const addressWhitelist = drizzle.contracts[this.state.whitelistAddress];
      this.setState({
        onWhitelistKey: addressWhitelist.methods.isOnWhitelist.cacheCall(account)
      });
    });
  }

  isCreateDisabled() {
    const sponsorWhitelist = this.props.drizzle.store.getState().contracts[this.state.whitelistAddress];
    if (!sponsorWhitelist) {
      return true;
    }

    const onWhitelist = sponsorWhitelist.isOnWhitelist[this.state.onWhitelistKey];
    if (!onWhitelist) {
      return true;
    }

    return !onWhitelist.value;
  }

  render() {
    const { classes, drizzleState } = this.props;
    const isCreateDisabled = this.isCreateDisabled();

    return (
      <React.Fragment>
        <CssBaseline />
        <div className="Dashboard">
          <AppBar className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <Typography component="h1" variant="h6" color="inherit" align="left" noWrap className={classes.title}>
                UMA Dashboard
              </Typography>
              <Typography component="h1" variant="h6" color="inherit" align="right" noWrap className={classes.title}>
                {drizzleState.accounts[0]}
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.appBarSpacer} />
          <Dialog
            open={this.state.contractDetailsOpen}
            onClose={this.handleDetailsModalClose}
            aria-labelledby="contract-details"
          >
            <DialogTitle>Contract Details</DialogTitle>
            <DialogContent>
              <ContractDetails
                contractAddress={this.state.openModalContractAddress}
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
              />
            </DialogContent>
          </Dialog>
          <CreateContractModal
            params={this.props.params}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            open={this.state.createContractOpen}
            onClose={this.handleCreateModalClose}
          />
          <Grid container spacing={16} direction="column" alignItems="center" align="center" className={classes.root}>
            <Grid item xs>
              <DerivativeList
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                buttonPushFn={this.handleDetailsModalOpen}
              />
            </Grid>
            <Grid item xs>
              <Button
                variant="contained"
                color="primary"
                disabled={isCreateDisabled}
                onClick={this.handleCreateModalOpen}
              >
                Create New Token Contract
              </Button>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
