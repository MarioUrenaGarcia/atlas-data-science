---
id: desigualdad-de-procesamiento-de-datos
titulo: Desigualdad de procesamiento de datos
titulo_en: Data processing inequality
alias:
  - DPI
  - teorema de procesamiento de datos
modulo: 0
submodulo: '0.8'
orden: 15
nivel: intermedio
prerrequisitos:
  - informacion-mutua
  - independencia-condicional
etiquetas:
  - información mutua
  - cadenas de Markov
  - canales
  - teoría de la información
resumen: >
  Si Z se obtiene de Y sin volver a mirar X, una cadena de Markov, ningún procesamiento de Y aumenta la información sobre X:
  I(X; Z) ≤ I(X; Y). Lo que se pierde en un paso no se recupera después.
formula: 'X \to Y \to Z \;\Longrightarrow\; I(X; Z) \le I(X; Y)'
visualizacion:
  componente: InformationViz
  parametros:
    modo: procesamiento
    ruido1: 0.1
    ruido2: 0
referencias:
  - clave: cover-thomas
    capitulo: '2'
publicado: true
---

## Intuición

En el juego del teléfono descompuesto, una frase pasa de oído en oído. Cada persona escucha solo a la anterior, así que lo que llega al final depende del mensaje original únicamente a través de lo que oyó el penúltimo. Por más cuidadosa que sea la última persona, no puede saber del mensaje original más de lo que sabía quien se lo contó.

La desigualdad de procesamiento de datos formaliza esa idea. Si una variable $Z$ se obtiene a partir de $Y$ sin mirar de nuevo a $X$, sea con una función, con ruido o con cualquier cálculo, entonces $Z$ contiene a lo más tanta información sobre $X$ como $Y$. Procesar datos puede hacer visible una información que ya estaba, pero nunca crear información nueva sobre la fuente.

Tiene consecuencias prácticas: ninguna transformación de los datos mejora el mejor clasificador posible, y un resumen estadístico solo conserva toda la información cuando es suficiente.

## Definición

:::definicion[Cadena de Markov de tres variables]
$X$, $Y$ y $Z$ forman una cadena $X \to Y \to Z$ si $X$ y $Z$ son condicionalmente independientes dado $Y$, es decir, $p(x, y, z) = p(x)\,p(y \mid x)\,p(z \mid y)$.
:::

:::teorema[Desigualdad de procesamiento de datos]
Si $X \to Y \to Z$, entonces
$$
I(X; Z) \le I(X; Y),
$$
con igualdad si y solo si también $X \to Z \to Y$, es decir, si $Z$ conserva toda la información de $Y$ sobre $X$. En particular, para cualquier función $g$, $I(X; g(Y)) \le I(X; Y)$.
:::

:::nota[Qué significa cada símbolo]
- $X$: fuente o variable de interés.
- $Y$: observación de $X$.
- $Z$: resultado de procesar $Y$.
- $p(x, y, z)$: distribución conjunta; $p(y \mid x)$, $p(z \mid y)$: condicionales de cada paso.
- $I(X; Y)$, $I(X; Z)$: informaciones mutuas.
- $g$: función cualquiera aplicada a $Y$.
:::

:::demostracion
Por la regla de la cadena de la información mutua, $I(X; Y, Z) = I(X; Z) + I(X; Y \mid Z) = I(X; Y) + I(X; Z \mid Y)$. La independencia condicional da $I(X; Z \mid Y) = 0$, así que $I(X; Z) = I(X; Y) - I(X; Y \mid Z) \le I(X; Y)$, porque la información mutua condicional es no negativa.
:::

## Cómo usar la visualización

Un bit $X$ equiprobable pasa por dos canales binarios simétricos: el primero lo invierte con probabilidad $\varepsilon_1$ y produce $Y$; el segundo invierte $Y$ con probabilidad $\varepsilon_2$ y produce $Z$. Las barras son $I(X; Y)$ e $I(X; Z)$. El control fija $\varepsilon_1$ y la reproducción sube $\varepsilon_2$ de 0 a 0.5.

Con $\varepsilon_1 = 0.1$ y $\varepsilon_2 = 0$, las dos barras miden 0.531 bits: copiar no pierde nada. Al aumentar $\varepsilon_2$, la barra de $I(X; Z)$ baja, a 0.320 con $\varepsilon_2 = 0.1$, y llega a cero en 0.5, mientras la de $I(X; Y)$ no se mueve. En ningún momento la segunda supera a la primera.

## Ejemplo

Una señal binaria se transmite a un repetidor con probabilidad de error 0.1 y del repetidor al receptor con probabilidad de error 0.2.

1. Primer tramo: $I(X; Y) = 1 - H_b(0.1) = 1 - 0.469 = 0.531$ bits.
2. Probabilidad de que $Z$ difiera de $X$: hay error si falla exactamente un tramo, $0.1 \cdot 0.8 + 0.9 \cdot 0.2 = 0.26$.
3. Cadena completa: $I(X; Z) = 1 - H_b(0.26) = 1 - 0.827 = 0.173$ bits.
4. El repetidor no puede devolver lo perdido: $0.173 \le 0.531$.

:::figura[Repetidor con errores 0.1 y 0.2: la información que llega al receptor parte de 0.173 bits, un tercio de los 0.531 que llegaron al repetidor, y sigue bajando al aumentar el ruido del segundo tramo.]{componente="InformationViz"}
```yaml
modo: procesamiento
ruido1: 0.1
ruido2: 0.2
```
:::

## Propiedades

- **Igualdad con estadísticos suficientes:** si $T(Y)$ es suficiente para un parámetro $X$, entonces $I(X; T(Y)) = I(X; Y)$.
- **Simetría de la cadena:** $X \to Y \to Z$ implica $Z \to Y \to X$, así que también $I(X; Z) \le I(Y; Z)$.
- **Primer tramo dominante:** la información que sale de la cadena está limitada por el tramo más ruidoso.

:::figura[Con un primer canal muy ruidoso, error 0.3, la barra de $I(X; Y)$ apenas llega a 0.119 bits; el segundo tramo solo puede quitar más, y la barra de $I(X; Z)$ cae hacia cero.]{componente="InformationViz"}
```yaml
modo: procesamiento
ruido1: 0.3
ruido2: 0
```
:::

- **Canales binarios simétricos en serie:** equivalen a un solo canal con error $\varepsilon_1(1 - \varepsilon_2) + \varepsilon_2(1 - \varepsilon_1)$.
- **Divergencias:** el mismo principio vale para la divergencia de Kullback-Leibler: aplicar el mismo canal a $p$ y $q$ no aumenta $D_{\mathrm{KL}}(p \,\|\, q)$.

## Errores comunes

- **Creer que el preprocesamiento agrega información.** Normalizar, extraer variables o filtrar puede facilitar el trabajo de un modelo, pero no aumenta la información sobre la variable objetivo que contienen los datos originales.
- **Aplicarla fuera de una cadena de Markov.** Si $Z$ se calcula usando también $X$, o información externa relacionada con $X$, la desigualdad no aplica.
- **Pensar que todo procesamiento pierde información.** Una transformación biyectiva, como copiar sin ruido, la conserva exactamente.

:::figura[Primer canal sin ruido y segundo canal que va de 0 a 0.5: Y es una copia de X con 1 bit de información, y Z conserva ese bit solo mientras el segundo canal no tiene errores.]{componente="InformationViz"}
```yaml
modo: procesamiento
ruido1: 0
ruido2: 0
```
:::

- **Confundir menos información con peor decisión en un caso particular.** La desigualdad es sobre promedios; un procesamiento puede acertar en un caso concreto y aun así perder información en promedio.

## Conexiones

Compara dos valores de la [[informacion-mutua]] a lo largo de una cadena definida por [[independencia-condicional]]. La demostración usa la regla de la cadena de la [[entropia-condicional]]. Los canales binarios de la visualización conectan con la idea de la [[entropia-de-shannon]] binaria y su versión para divergencias se aplica a la [[divergencia-de-kullback-leibler]].

## Formulario

:::formula[Desigualdad de procesamiento de datos]
$$
X \to Y \to Z \;\Longrightarrow\; I(X; Z) \le I(X; Y)
$$

- $X \to Y \to Z$: $X$ y $Z$ son condicionalmente independientes dado $Y$; $I$: información mutua.
:::

:::formula[Canal binario simétrico]
$$
I(X; Y) = 1 - H_b(\varepsilon)
$$

- $X$: bit equiprobable; $\varepsilon$: probabilidad de inversión; $H_b$: entropía binaria.
:::

:::formula[Dos canales en serie]
$$
\varepsilon_{XZ} = \varepsilon_1(1 - \varepsilon_2) + \varepsilon_2(1 - \varepsilon_1)
$$

- $\varepsilon_1$, $\varepsilon_2$: probabilidades de error de cada canal; $\varepsilon_{XZ}$: probabilidad de que $Z$ difiera de $X$.
:::
