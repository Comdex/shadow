import { isReady, shutdown, UInt32, Poseidon, PublicKey, Field, UInt64, Signature } from 'snarkyjs';
import express, { Express, Response, Request } from 'express';
import { AppState, initState } from '../store';
import { QueryService } from '../service/query_service';
import { ShieldTxReceipt } from '@/models/tx';
import { Account } from '@/models/account';
import { transfer } from '../branches/transfer';
import { TransferArgs, TransferProof } from '@/zkapp/proof';

export const createApp = async (): Promise<Express> => {
  await isReady;

  const app = express();
  app.use(express.json());

  const appState = initState();
  app.set('state', appState);

  // mock a account
  app.post('/register_account', async (req: Request, res: Response) => {
    try {
      return res.send(QueryService.createAccount().toJSON());
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        err: err,
        data: undefined
      });
    }
  });

  app.post('/get_pendingtxs', async (req: Request, res: Response) => {
    try {
      const nameHash = req.body.nameHash!;
      const state: AppState = app.get('state');

      let rcTxDb = state.allUserRcTxDb.get(nameHash);
      let pendingTxs: ShieldTxReceipt[] = [];
      rcTxDb.dataStore.forEach((v: ShieldTxReceipt) => {
        pendingTxs.push(v);
      });

      return res.send(pendingTxs);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        err: err,
        data: undefined
      });
    }
  });

  app.post('/get_account', async (req: Request, res: Response) => {
    try {
      const nameHash = req.body.nameHash!;
      const state: AppState = app.get('state');

      let account = state.accountDb.get(nameHash);
      account.isSome.assertEquals(true);

      return res.send(account.value.toJSON());
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        err: err,
        data: undefined
      });
    }
  });

  app.post('/transfer', async (req: Request, res: Response) => {
    try {
      const nameHash = Field.fromJSON(req.body.nameHash);
      const accountsCommitment = Field.fromJSON(req.body.accountsCommitment);
      const finalAccount = Account.fromJSON(req.body.finalAccount);
      const pendingRcTxRootsCommitment = Field.fromJSON(req.body.pendingRcTxRootsCommitment);
      const newPendingTx = ShieldTxReceipt.fromJSON(req.body.pendingRcTxRootsCommitment);
      const newOwnPendingTx = ShieldTxReceipt.fromJSON(req.body.newOwnPendingTx);
      const fee = new UInt32(Field.fromJSON(req.body.fee));

      let trProof = new TransferProof(
        new TransferArgs(
          nameHash,
          accountsCommitment,
          finalAccount,
          [],
          pendingRcTxRootsCommitment,
          newPendingTx,
          newOwnPendingTx,
          fee
        )
      );
      const state: AppState = app.get('state');
      let rcTxDb = state.allUserRcTxDb.get(nameHash.toString());
      let accountsCommitmentOnChain = state.accountsCommitmentOnChain;
      let pendingRcTxRootsCommitmentOnChain = state.pendingRcTxRootsCommitmentOnChain;
      let rs = transfer(
        trProof,
        state.accountDb,
        state.pendingRcTxRootDb,
        rcTxDb,
        accountsCommitmentOnChain,
        pendingRcTxRootsCommitmentOnChain
      );
      // TODO
      // add to queue

      res.send();
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        err: err,
        data: undefined
      });
    }
  });

  app.post('/withdraw', async (req: Request, res: Response) => {});
};
