/**
 * @fileoverview 场景的配置文件
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-01-27
 */

$import("config.Configure");

$package("config","Scene",
		{
			CHINA:{
				front:{
					IMG:config.Configure.url+"images/background/china/front.gif",
					WIDTH:621,
					HEIGHT:224
				},
				
				behind:{
					IMG:config.Configure.url+"images/background/china/behind.gif",
					WIDTH:535,
					HEIGHT:176
				}
			}
		}
);