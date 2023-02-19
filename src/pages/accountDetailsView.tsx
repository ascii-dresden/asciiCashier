import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";
import { TransactionList } from "../components/transaction/transactions.list";
import React, { useEffect, useState } from "react";
import { useGetAccountQuery } from "../redux/api/accountApi";
import { toast } from "react-toastify";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { UpdateAccountDialog } from "../components/account/updateAccountDialog";
import { CoinAmountView } from "../components/CoinAmountView";

export const AccountDetailsView = (props: {
  accountId: number;
  isRoot?: boolean;
}) => {
  const navigate = useNavigate();
  const {
    isLoading,
    isError,
    error,
    data: account,
  } = useGetAccountQuery(props.accountId);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !account) {
    return <FullScreenLoader />;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={0}>
        <Box sx={{ px: 1, py: 2, mb: 3 }}>
          <Toolbar
            disableGutters={true}
            sx={{ justifyContent: "space-between" }}
          >
            <div>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                component="div"
              >
                {account.name}

                <Chip sx={{ ml: 2 }} size="small" label={account.role} />
              </Typography>

              {props.isRoot ? (
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    color="text.primary"
                    aria-current="page"
                    onClick={() => navigate("/")}
                  >
                    ascii-pay
                  </Link>
                </Breadcrumbs>
              ) : (
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/")}
                  >
                    ascii-pay
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/accounts")}
                  >
                    Accounts
                  </Link>
                  <Link
                    underline="hover"
                    color="text.primary"
                    aria-current="page"
                    onClick={() => navigate(`/accounts/${props.accountId}/`)}
                  >
                    {account.name}
                  </Link>
                </Breadcrumbs>
              )}
            </div>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Edit />}
              sx={{ whiteSpace: "nowrap", width: "7rem" }}
              onClick={() => setOpenModal(true)}
            >
              Edit
            </Button>
          </Toolbar>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", mb: 4 }}>
        <Paper sx={{ mr: 4, flex: "1 1 100%" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h6" component="div">
              Balance
            </Typography>
            <CoinAmountView coins={account.balance} />
          </Box>
        </Paper>
        <Paper sx={{ flex: "1 1 100%" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h6" component="div">
              Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {account.email}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <TransactionList account={account} />

      <UpdateAccountDialog
        account={account}
        open={openModal}
        setOpen={setOpenModal}
      />
    </Container>
  );
};
