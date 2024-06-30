import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import "./setup.js";

describe("User Management", () => {
  let user1, user2;

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    user1 = await request(app).post("/signup").send({
      userType: "applicant",
      email: "user1@example.com",
      password: "password123",
      fullName: "John Doe",
      companyName: "Tech Corp",
    });

    user2 = await request(app).post("/signup").send({
      userType: "applicant",
      email: "user2@example.com",
      password: "password123",
      fullName: "Doe John",
      companyName: "Tech Corp",
    });
  });

  it("should not allow updating email to an email that already exists", async () => {
    const res = await request(app).put("/updateUser").send({
      email: "user1@example.com",
      newEmail: "user2@example.com",
    });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property(
      "message",
      "New email already used by another account",
    );
  });

  it("should update name, address and positions", async () => {
    const res = await request(app).put("/updateUser").send({
      email: "user1@example.com",
      newEmail: "newuser1@example.com",
      fullName: "New Name",
      address: "New Address",
      positions: "New Position",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Update successful");
    expect(res.body).to.have.property("email", "newuser1@example.com");
    expect(res.body).to.have.property("fullName", "New Name");
    expect(res.body).to.have.property("address", "New Address");
    expect(res.body).to.have.property("positions", "New Position");
  });
  
  it("should update the master resume", async () => {
    const res = await request(app).put("/updateUser").send({
      email: "user1@example.com",
      masterResume: "data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggNDY1Pj4Kc3RyZWFtCnicbZJLb9swEITv+RV7TICYJakHRZ9a22mBAAWMxkUfyIWmVjYNmRQoKo7/fSnJBlwoB12ImW9HO8vh+Y6STMDpbrGBT18ZME4ohU0FT5v+iRc5YQkImREhYFPC/bPbW1g5fIDN4SriBREURC5IygfR01GZeg6HqCWlw8/4ro5NjUS7460vo4QxEIkkdISv987iHF7vGU9eHyDN8pkoJL3xDBnpfxkTRpiEvOBEFuP09wa9QatvQ15UWUryZFC9uCqclEdY4RvWLlpABfiyWMLSHRtlz1MzzwmX4xaU7ZQ/A6ecwgzWHlu0YeLIpCAyHRw/sG2cbc3W1CYYbOcwVeeS5HRQz66pjN3BCbegmqY2WgUTGdC1/fP6HOK6QNkSVgdld+4DYsoIzy7EpatrtXU+QnqoCXvQ3rXtrOqs7sGqhoDq2EJwUGJlLA5wpfcmhoHGuwPqADun6vaDWfF05DX9L2+GKbpGZR8hnoMN8VPbGh8HKFaV0bGjANqV055SQUlyabPsxv+eitJ4rON2FzFkXJcHV8GLHroHY4cmuxCbvbxNESwh+VjpT2ve0LcmnHvI7z9/J+KkyEgyzvvmVdmpgOUcvqv+DJi8yv8BjhzvWwplbmRzdHJlYW0KZW5kb2JqCjEgMCBvYmoKPDwvVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSIF0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1LjI4IDg0MS44OV0KPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZSAvRm9udAovQmFzZUZvbnQgL0hlbHZldGljYQovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Ci9GMSA1IDAgUgo+PgovWE9iamVjdCA8PAo+Pgo+PgplbmRvYmoKNiAwIG9iago8PAovUHJvZHVjZXIgKFB5RlBERiAxLjcuMiBodHRwOi8vcHlmcGRmLmdvb2dsZWNvZGUuY29tLykKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDYxNDA0NTI1NSkKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCi9PcGVuQWN0aW9uIFszIDAgUiAvRml0SCBudWxsXQovUGFnZUxheW91dCAvT25lQ29sdW1uCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA2MjIgMDAwMDAgbiAKMDAwMDAwMDgwNSAwMDAwMCBuIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwODcgMDAwMDAgbiAKMDAwMDAwMDcwOSAwMDAwMCBuIAowMDAwMDAwOTA5IDAwMDAwIG4gCjAwMDAwMDEwMTggMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDcgMCBSCi9JbmZvIDYgMCBSCj4+CnN0YXJ0eHJlZgoxMTIxCiUlRU9GCg==",
      newMasterResume: "data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggNDQxPj4Kc3RyZWFtCnicbZJLb9wgFIX3+RV3mSyGAn5gZtVkklaKVClqXKmtsmHsmzGpDRbgyePXFz9GmsrdGfOdcw8cONxfUJIJeL24KeHTFwaME0qhfIa7cvzFC0YKCkJmRAgoa7i8VwbhsdOhuYLy5YTxlCQCRC5IyifsrlO63cJLpIkf6c/4prq+RVLZ7lyZUcIYiEQSOg94aKzBLTxdykI8XUGepZuEM3qmmXLSf3ImjDAJecGJLOb5bz06jabCM+FCZSnJk4m6VUHBtVHtuw+gAvz89Rt21vVrDc8Jl5Pmm3JVA5yyAjbw4NCjCSs+k4LIdOK/o++t8XqvWx00+i2s6VySnE70Zo7zoc0BWuUOCHXM6DF4CBZ6Z4+6RlBV0NaofYugo/Whidtr15QRni2uO4cqjKajHRy1H1SrP9Ro42Hw4045+qnhP0bxUchTvJ1tW7W3bnZ7jc2CD+oPNrat0U0pBzN+BWXqeZpBrP3KNRWUJEtZ9VBNUdZQGt9juty7D+jAPsNjNRUbjw5Tgct6LWYJyefSfhh9jJl0eB8Nrm92KzgpMpLMk746VQ8qYL2FW6yw28exsW9x0vwF2B7k7wplbmRzdHJlYW0KZW5kb2JqCjEgMCBvYmoKPDwvVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSIF0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1LjI4IDg0MS44OV0KPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZSAvRm9udAovQmFzZUZvbnQgL0hlbHZldGljYQovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Ci9GMSA1IDAgUgo+PgovWE9iamVjdCA8PAo+Pgo+PgplbmRvYmoKNiAwIG9iago8PAovUHJvZHVjZXIgKFB5RlBERiAxLjcuMiBodHRwOi8vcHlmcGRmLmdvb2dsZWNvZGUuY29tLykKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDYxNDA0NTM0MCkKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCi9PcGVuQWN0aW9uIFszIDAgUiAvRml0SCBudWxsXQovUGFnZUxheW91dCAvT25lQ29sdW1uCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA1OTggMDAwMDAgbiAKMDAwMDAwMDc4MSAwMDAwMCBuIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwODcgMDAwMDAgbiAKMDAwMDAwMDY4NSAwMDAwMCBuIAowMDAwMDAwODg1IDAwMDAwIG4gCjAwMDAwMDA5OTQgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDcgMCBSCi9JbmZvIDYgMCBSCj4+CnN0YXJ0eHJlZgoxMDk3CiUlRU9GCg==",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Update successful");
  });
});
