# cnokey

[CanoKey 管理平台 ](https://console.canokeys.org/#/openpgp)

## PGP

```bash
# 下载Gpg4Win
# 生成主密钥
gpg --expert --full-gen-key 
# (11)选择ECC(set your own capabilities)
# (S) Toggle the sign capability
# (Q) Finished
# (1) Curve 25519 *default*
# 0 = key does not expire
# y

Real name
Email address
Comment

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? o

# 查看目前的私钥(密钥指纹)
gpg --fingerprint --keyid-format long -K

[keyboxd]
---------
sec   ed25519/xxxxxxxxxx 2023-12-04 [C]
      Key fingerprint = dddddddddddddddddddd
uid                 [ultimate] mzmm403 (eihei) <1727328835@qq.com>
ssb   ed25519/aaaaaaaaaa 2023-12-04 [S]
ssb   ed25519/bbbbbbbbbb 2023-12-04 [A]
ssb   cv25519/cccccccccc 2023-12-04 [E]

# xxxxxxxxxx/aaaaaaaaaa/bbbbbbbbbb/cccccccccc: 指纹
# dddddddddddddddddddd：公钥
# sec后面的内容：私钥
# ssb后面的内容：子密钥

# 生成不同功能的子密钥
gpg --quick-add-key <密钥指纹> cv25519 encr # 生成加密功能的子密钥
gpg --quick-add-key <密钥指纹> ed25519 auth # 生成认证功能的子密钥
gpg --quick-add-key <密钥指纹> ed25519 sign # 生成签发功能的子密钥

# 备份密钥
gpg -ao public-key.pub --export 公钥
gpg -ao sec-key.asc --export-secret-key 子密钥!
gpg -ao sign-key.asc --export-secret-key 子密钥!
gpg -ao auth-key.asc --export-secret-key 子密钥!
gpg -ao encr-key.asc --export-secret-key 子密钥!

# 导入Canokey
gpg --edit-card   # 进入编辑Canokey模式
admin     # 进入admin模式
passwd    # 修改密码  这里修改PIN和amdin PIN 
# PIN的默认密码是123456     admin的默认密码是12345678
q         # 直接退出即可
# 退出编辑card模式

gpg --edit-key 密钥指纹

key 1 # 选择密码
keytocard # 将密码写入卡片
# 注意选择的功能必须和密钥的功能对应

# 配置服务器的ssh
# 更改文件
# user\自己的用户名\AppData\remote\gnupg\gpg-agent.conf
# 如果没有gpg-agent.conf就自己创建
# 向文件中添加enable-win32-openssh-support

gpg-connect-agent killagent /bye
gpg-connect-agent /bye

ssh-add -L   #　获取公钥

ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAzFAR5puWAj0OflZJVzAJqejVEZCap2NhFJbzedYwX2 cardno:F1D0 xxxxxxxx   # 获取的公钥并将公钥放入服务器的“~/.ssh/authorized_keys”目录


# 配置git就是将public-key.pub粘贴到相关的git平台，在CanoKey 管理平台配置即可
# 使用子密钥中的s密钥来配置git
git config --global user.signingkey s密钥指纹
# 打开自动gpg自动签名
git config commit.gpgsign true
# 手动commit使用gpg签名
git commit -S ...

```

