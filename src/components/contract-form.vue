<template>
  <el-drawer
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="title">
      <img src="../../../../public/images/title.png">
      <span class="font" v-if="dataForm.id">编辑</span>
      <span class="font" v-else>新增</span>
    </div>
    <cy-scrollbar height="90vh" v-loading="loading">
      <el-form :model="dataForm" :rules="dataRules" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="110px">
        <el-form-item label="公司名称" prop="customersId">
          <el-select v-model="dataForm.customersId" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.customer_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="合同总金额"  prop="contractAmount">
             <el-popover
              placement="top"
              width="386"
              trigger="focus"
              :content="convertCurrency ? convertCurrency :'请输入...'">
               <el-input v-model="dataForm.contractAmount" placeholder="合同总金额"  slot="reference"></el-input>
            </el-popover>
        </el-form-item>
       
        <!--<el-form-item label="合同总金额" prop="contractAmount">
          <el-input v-model="dataForm.contractAmount" placeholder="合同总金额"></el-input>
        </el-form-item>
        -->
        <el-form-item label="合同标题" prop="contractName">
          <el-input v-model="dataForm.contractName" placeholder="合同标题"></el-input>
        </el-form-item>
        <!-- 打印返回的附加字段 -->
        <cy-common-form :item="item" v-for="(item,index) in colums.tableHead" :key="index"></cy-common-form>
        <el-form-item v-if="permissions.crm_contract_finance" label="付款状态" prop="paymentStatus">
          <el-select v-model="dataForm.paymentStatus" filterable clearable placeholder="请选择付款状态" style="width: 100%">
            <el-option v-for="item in paymentStatusList" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="permissions.crm_contract_finance" label="到账金额" prop="arriveAmount">
          <el-input v-model="dataForm.arriveAmount" placeholder="到账金额"></el-input>
        </el-form-item>
        <div class="import">
          <el-upload
            ref="uploadFile"
            action="/crm/uploadContract"
            :limit=limitNum
            :headers="headers"
            :before-remove="beforeRemove"
            accept=".docx, .doc, .pdf, .png, .jpg, .gif"
            :on-exceed="exceedFile"
            :on-success="uploadSuccess"
            :on-progress="uploading"
            :on-error="uploadFalse"
            :file-list="fileList">
            <el-button style="margin-left: 10px;" icon="el-icon-plus" type="primary" size="mini">合同上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </div>
      </el-form>
      <span class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" class="tr" :loading="isSubmit" :disabled="isUpload">{{ isSubmit ? '提交中 ...' : '确认' }}</el-button>
    </span>
    </cy-scrollbar>
  </el-drawer>
</template>

<script>
  import {addObj, putObj, contractDict, getFields, getContractByid} from '@/api/contract'
  import {getCustomerAll} from '@/api/customer'
  import {getStore} from '@/util/store.js'
  import {mapGetters} from 'vuex'
  import CyScrollbar from '@/components/cy-scrollbar'
  import CyCommonForm from '@/components/cy-common-form'

  export default {
    components: {CyScrollbar, CyCommonForm},
    computed: {
      ...mapGetters(['permissions']),
      headers() {
        let token = getStore({name: 'access_token'})
        return {
          'Authorization': 'Bearer ' + token,
        }
      },
      convertCurrency() {
          var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
          var cnIntRadice = new Array('', '拾', '佰', '仟');
          var cnIntUnits = new Array('', '万', '亿', '兆');
          var cnDecUnits = new Array('角', '分', '毫', '厘');
          var cnInteger = '整';
          var cnIntLast = '元';
          var maxNum = 999999999999999.9999;
          var integerNum;
          var decimalNum;
          var chineseStr = '';
          var parts;
          var money = this.dataForm.contractAmount;
          if (money == '') { return ''; }
          money = parseFloat(money);
          if (money >= maxNum) {
            return '';
          }
          if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
          }
          money = money.toString();
          if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
          } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
          }
          if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
              var n = integerNum.substr(i, 1);
              var p = IntLen - i - 1;
              var q = p / 4;
              var m = p % 4;
              if (n == '0') {
                zeroCount++;
              } else {
                if (zeroCount > 0) {
                  chineseStr += cnNums[0];
                }
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
              }
              if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
              }
            }
            chineseStr += cnIntLast;
          }
          if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
              var n = decimalNum.substr(i, 1);
              if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
              }
            }
          }
          if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
          } else if (decimalNum == '') {
            chineseStr += cnInteger;
          }
          return chineseStr;
        }
    },
    data() {
      return {
        loading: false,
        limitNum: 1,//文件上传数量限制
        dataRules: {
          customersId: [
            {required: true, message: '请选择公司名称', trigger: 'blur'},
          ],
          contractName: [
            {required: true, message: '请选择公司名称', trigger: 'blur'},
          ],
          contractAmount: [
            {required: true, message: '合同金额不能为空', trigger: 'blur'},
            {
              pattern: /^(([1-9]\d*)|(0))(\.\d{1,2})?$/,
              message: '合同金额格式不正确',
              trigger: 'blur'
            }
          ],
          arriveAmount: [
            {
              pattern: /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/,
              message: '到账金额格式不正确',
              trigger: 'blur'
            }
          ]
        },
        fileList: [],
        contractTypeList: {},
        contractStatesList: {},
        cid: '',
        customerList: [],
        state: {},
        contractTypeItem: {},
        visible: false,
        dataForm: {
          contractStorageAddress: '',
          customersId: null,
          id: 0,
          contractName: '',
          contractAmount: '',
          signingDate: null,
          contractNumber: '',//合同编号
          contractStartDate: '',//合同开始时间
          contractStopDate: '',//合同结束时间
          fields: "",
          arriveAmount: null,
          paymentStatus: '0'
        },
        paymentStatusList: [],//付款状态
        colums: [],
        isSubmit: false,
        isUpload: false
      }
    },
    created() {
      this.contractTypeOption()
      this.contractStatesOption()
      this.getCustomerAll()
      this.loadPaymentOption()
    },
    methods: {
      //用户修改前信息查询
      init(id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            this.loading = true
            getContractByid(this.dataForm.id).then(res => {
              this.loading = false
              const data = res.data.data
              this.colums = data
              const form = data.fields[0]
              form.paymentStatus = form.paymentStatus + ''
              this.dataForm = form
            })
          } else {
            this.loading = true
            getFields().then(res => {
              this.loading = false
              this.colums = {tableHead: res.data.data}
            })
          }
        })

      },
      // 表单提交
      dataFormSubmit() {
        this.dataForm.contractAmount = this.dataForm.contractAmount.toString()
        this.$refs['dataForm'].validate((valid) => {
          const fields = {}
          // 将 附加字段拼接到dataform
          this.colums.tableHead.forEach(item => {
            const value = item.value
            const name = item.name
            if (value) {
              fields[name] = value
            }
          })
          this.dataForm.fields = JSON.stringify(fields)
          if (valid && !this.isSubmit) {
            this.isSubmit = true
            if (this.dataForm.id) {
              putObj(this.dataForm).then(data => {
                this.isSubmit = false
                this.$message.success('修改成功')
                this.visible = false
                this.$emit('refreshDataList')
                this.fileList = []
                this.dataForm.contractStorageAddress = ''
              });
            } else {
              const data = {...this.dataForm}
              data.tenantId = undefined
              data.followDate = undefined
              data.followRecordId = undefined
              if (!data.signingDate || data.signingDate === "") {
                data.signingDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
              }
              addObj(data).then(data => {
                this.isSubmit = false
                this.$message.success('添加成功')
                this.visible = false
                this.$emit('refreshDataList')
                this.fileList = []
                this.dataForm.contractStorageAddress = ''
              })
            }
          }
        })
      },
      // 文件超出个数限制时的钩子
      exceedFile(files, fileList) {
        this.$notify.warning({
          title: '警告',
          message: `只能选择1个文件`
        });
      },

      //文件上传成功
      uploadSuccess(response) {
        this.isUpload = false
        this.dataForm.contractStorageAddress = response.data
        if (response.code == 0) {
          this.$message({
            message: "合同导入成功",
            type: 'success',
          });
        } else {
          this.$message({
            message: '合同导入失败！',
            type: 'error'
          });
        }
      },
      //文件上传失败
      uploadFalse() {
        this.$message({
          message: '文件上传失败！',
          type: 'error'
        });
        this.dataForm.contractStorageAddress = ''
      },
      //上传时禁用提交按钮
      uploading(){
        this.isUpload = true
      },
      //删除文件的提示
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`).then(() => {
            this.$refs['uploadFile'].clearFiles()
            this.dataForm.contractStorageAddress = ''
          }
        );
      },

      //字典类型查询
      contractTypeOption() {
        contractDict('contract_type').then(res => {
          this.contractTypeList = res.data.data
        })
      },

      loadPaymentOption(){
        contractDict('payment_status').then(res => {
          //console.log(res.data.data)
          this.paymentStatusList = res.data.data
        })
      },
      //字典合同来源查询
      contractStatesOption() {
        contractDict('contract_state').then(res => {
          this.contractStatesList = res.data.data
        })
      },
      async getCustomerAll() {
        const {data: {data}} = await getCustomerAll()
        this.customerList = data
      }
    }
  }
</script>
<style scoped lang="scss">
  .import {
    margin-bottom: 20px;
    margin-left: 100px;
  }

  /deep/ .el-drawer__header {
    margin-bottom: 20px;
  }

  /deep/ .el-drawer__close-btn {
    display: none;
  }

  .dialog-footer {
    float: right;
    margin-right: 20px;
  }

  .el-col {
    margin-bottom: 0
  }

  .title {
    display: flex;
    position: relative;
    top: -28px;
    left: 8px;

    .font {
      color: #5499ff;
      font-size: 20px;
    }
  }
</style>
