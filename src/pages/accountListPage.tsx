import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  useDeleteAccountMutation,
  useGetAllAccountsQuery,
} from "../redux/api/accountApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/FullScreenLoader";
import { Add } from "@mui/icons-material";
import { CreateAccountDialog } from "../components/account/createAccountDialog";
import { useNavigate } from "react-router-dom";
import { stringAvatar } from "../components/stringAvatar";
import { CoinAmountView } from "../components/CoinAmountView";
import { UpdateAccountDialog } from "../components/account/updateAccountDialog";
import { AccountDto } from "../redux/api/contracts";

export const AccountListPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: accounts,
  } = useGetAllAccountsQuery();

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

  if (isLoading || accounts === undefined) {
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
                Accounts
              </Typography>
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
                  color="text.primary"
                  aria-current="page"
                  onClick={() => navigate("/accounts")}
                >
                  Accounts
                </Link>
              </Breadcrumbs>
            </div>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Add />}
              sx={{ whiteSpace: "nowrap", width: "13rem" }}
              onClick={() => setOpenModal(true)}
            >
              New account
            </Button>
          </Toolbar>
        </Box>
      </Paper>
      <TableContainer component={Paper} elevation={4}>
        <Table sx={{ minWidth: 650 }} aria-label="Account table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.map((account) => (
              <AccountListRow key={account.id} account={account} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateAccountDialog open={openModal} setOpen={setOpenModal} />
    </Container>
  );
};

const AccountListRow = (props: { account: AccountDto }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [deleteAccount, { isLoading, error, isSuccess, isError }] =
    useDeleteAccountMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account deleted successfully");
    }

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

  const onDeleteHandler = (id: number) => {
    if (window.confirm("Are you sure")) {
      deleteAccount(id);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Avatar
            alt={props.account.name}
            {...stringAvatar(props.account.name)}
          />
        </TableCell>
        <TableCell>
          <Typography>{props.account.name}</Typography>
          <Typography variant="caption">{props.account.role}</Typography>
        </TableCell>
        <TableCell>{props.account.email}</TableCell>
        <TableCell>
          <CoinAmountView coins={props.account.balance} />
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => navigate(`/accounts/${props.account.id}`)}>
              Profile
            </Button>
            <Button onClick={() => setOpenModal(true)}>Edit</Button>
            <Button onClick={() => onDeleteHandler(props.account.id)}>
              Delete
            </Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <UpdateAccountDialog
        account={props.account}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
};
