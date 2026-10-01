---
id: maximos-y-minimos
titulo: Máximos y mínimos
titulo_en: Maxima and minima
alias:
  - extremos
  - puntos críticos
  - optimización de una variable
  - extremos locales y globales
modulo: 0
submodulo: '0.4'
orden: 8
nivel: basico
prerrequisitos:
  - derivadas-de-orden-superior
etiquetas:
  - optimización
  - puntos críticos
  - extremos
  - criterio de la derivada
resumen: >
  Los máximos y mínimos locales de una función derivable ocurren donde la derivada vale cero o no existe;
  el signo de la derivada alrededor, o la segunda derivada, decide de qué tipo es cada uno.
formula: 'f''(c) = 0,\quad f''''(c) > 0 \Rightarrow \text{mínimo local},\quad f''''(c) < 0 \Rightarrow \text{máximo local}'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: derivadas
    funciones: [cuartica, seno, gauss]
    orden: 1
    criticos: true
referencias:
  - clave: blitzstein-hwang
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

En la cima de una colina o en el fondo de un valle el terreno está momentáneamente plano: la pendiente vale cero. Por eso, para buscar los valores más altos o más bajos de una función suave, basta revisar los puntos donde su derivada se anula, los puntos críticos, y los extremos del intervalo donde está definida.

No todo punto plano es cima o valle. Para distinguirlos se mira cómo cambia la pendiente al cruzarlo: si pasa de subir a bajar, es un máximo; si pasa de bajar a subir, un mínimo; si no cambia de signo, es un rellano. La segunda derivada da la misma información sin mirar alrededor: un tazón (curvatura positiva) tiene fondo, un domo tiene cima. Ajustar un modelo estadístico o entrenar una red neuronal consiste, al final, en buscar el mínimo de una función de error.

## Definición

:::definicion[Extremos]
$f$ tiene un **máximo local** en $c$ si $f(c) \ge f(x)$ para todo $x$ cercano a $c$, y un **máximo global** en un conjunto $D$ si $f(c) \ge f(x)$ para todo $x \in D$; los mínimos se definen invirtiendo la desigualdad. Un **punto crítico** es un $c$ del dominio con $f'(c) = 0$ o donde $f'(c)$ no existe.
:::

:::teorema[Condiciones de extremo]
**Fermat:** si $f$ tiene un extremo local en un punto interior $c$ y es derivable ahí, entonces $f'(c) = 0$.
**Primera derivada:** si $f'$ cambia de positiva a negativa en $c$, hay un máximo local; de negativa a positiva, un mínimo local.
**Segunda derivada:** si $f'(c) = 0$ y $f''(c) > 0$, hay un mínimo local; si $f''(c) < 0$, un máximo local.
:::

:::nota[Qué significa cada símbolo]
- $f$: función que se optimiza.
- $c$: candidato a extremo.
- $D$: conjunto donde se busca el extremo global.
- $f'(c)$: pendiente en $c$; cero en un punto crítico suave.
- $f''(c)$: curvatura en $c$; su signo clasifica el punto crítico.
:::

## Cómo usar la visualización

El fondo de la gráfica superior está sombreado en verde donde la función crece ($f' > 0$) y en rosa donde decrece ($f' < 0$). Los puntos críticos aparecen como círculos, etiquetados como máximo o mínimo según la segunda derivada. Abajo, la gráfica de $f'$ muestra por qué: cada punto crítico es un cruce de la derivada con el eje.

En la cuártica hay dos mínimos y un máximo, y solo uno de los mínimos es global. En la curva de Gauss hay un solo punto crítico, un máximo global en 0. En el seno los extremos se repiten con periodo $2\pi$.

## Ejemplo

La concentración de un fármaco en sangre sigue $C(t) = t\,e^{-t}$ (unidades arbitrarias, $t$ en horas). Se busca el momento de máxima concentración.

1. $C'(t) = (1 - t)e^{-t}$, que se anula solo en $t = 1$.
2. Para $t < 1$, $C' > 0$ (sube); para $t > 1$, $C' < 0$ (baja): hay un máximo en $t = 1$.
3. Confirmación: $C''(t) = (t - 2)e^{-t}$ y $C''(1) = -e^{-1} < 0$.
4. Concentración máxima: $C(1) = e^{-1} \approx 0.368$.
5. En $[0, \infty)$ ese máximo es global, porque $C(0) = 0$ y $C(t) \to 0$ cuando $t \to \infty$.

:::figura[La concentración del fármaco del ejemplo: crece hasta t = 1, donde la derivada cruza el cero, y después decrece. La segunda derivada negativa en ese punto confirma el máximo.]{componente="CalculusViz"}
```yaml
modo: derivadas
funciones: [x-exp]
orden: 2
criticos: true
```
:::

## Propiedades

- **Extremos globales en un intervalo cerrado:** si $f$ es continua en $[a, b]$, el máximo y el mínimo globales están entre los puntos críticos y los extremos $a$ y $b$.
- **Puntos críticos no extremos:** $x^3$ tiene $f'(0) = 0$ sin máximo ni mínimo.
- **Extremos sin derivada:** $|x|$ tiene un mínimo en 0, donde no es derivable.
- **Convexidad:** si $f$ es convexa, todo mínimo local es global.
- **Transformaciones monótonas:** $f$ y $\log f$ (con $f > 0$) tienen los máximos en los mismos puntos, lo que simplifica la máxima verosimilitud.

:::figura[Caso de extremos solo locales: en x³ - 3x el máximo en -1 y el mínimo en 1 no son globales, porque la función sigue creciendo y decreciendo sin cota fuera de la ventana. Las zonas sombreadas muestran dónde crece y dónde decrece.]{componente="CalculusViz"}
```yaml
modo: derivadas
funciones: [cubica]
criticos: true
```
:::

:::demostracion
Fermat: si $f$ tiene un máximo local en $c$, para $h > 0$ pequeño $\frac{f(c + h) - f(c)}{h} \le 0$ y para $h < 0$ el cociente es $\ge 0$. Los dos límites laterales son $f'(c)$, que debe ser a la vez $\le 0$ y $\ge 0$: vale cero.
:::

## Errores comunes

- **Tomar todo punto con $f' = 0$ como extremo.** Hay que clasificarlo; puede ser un punto de inflexión horizontal.
- **Olvidar los extremos del intervalo.** En $[0, 3]$ el máximo de $x^2$ está en $x = 3$, donde $f' \neq 0$.
- **Confundir extremo local con global.** Un valle puede no ser el más profundo.
- **Ignorar puntos donde la derivada no existe.** Las esquinas también son candidatas.

## Conexiones

La búsqueda de extremos usa la [[derivada-como-pendiente-y-razon-de-cambio|derivada]] y las [[derivadas-de-orden-superior]]. En las [[funciones-convexas-y-concavas]] los extremos locales son globales. En estadística, los estimadores de máxima verosimilitud son máximos de una función, y en aprendizaje automático el entrenamiento minimiza una función de pérdida con variantes del descenso de gradiente.

## Formulario

:::formula[Condición necesaria (Fermat)]
$$
c \text{ extremo local interior},\ f \text{ derivable en } c \ \Rightarrow\ f'(c) = 0
$$

- $c$: punto interior del dominio.
:::

:::formula[Criterio de la segunda derivada]
$$
f'(c) = 0,\ f''(c) > 0 \Rightarrow \text{mínimo}; \qquad f'(c) = 0,\ f''(c) < 0 \Rightarrow \text{máximo}
$$

- Si $f''(c) = 0$ el criterio no decide.
:::

:::formula[Extremos globales en un intervalo cerrado]
$$
\max_{[a, b]} f = \max\{f(a),\ f(b),\ f(c_1), \dots, f(c_k)\}
$$

- $c_1, \dots, c_k$: puntos críticos en $(a, b)$.
:::
