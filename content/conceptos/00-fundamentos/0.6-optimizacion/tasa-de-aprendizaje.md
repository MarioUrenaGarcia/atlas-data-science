---
id: tasa-de-aprendizaje
titulo: Tasa de aprendizaje
titulo_en: Learning rate
alias:
  - tamaño de paso
  - step size
  - learning rate
modulo: 0
submodulo: '0.6'
orden: 6
nivel: intermedio
prerrequisitos:
  - descenso-de-gradiente
  - matriz-hessiana
etiquetas:
  - tasa de aprendizaje
  - estabilidad
  - convergencia
  - descenso de gradiente
resumen: >
  La tasa de aprendizaje η fija el tamaño de cada paso del descenso de gradiente: si es pequeña el método es
  lento, y si supera 2/λmax, con λmax la mayor curvatura, oscila cada vez más y diverge.
formula: '\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k), \qquad 0 < \eta < \frac{2}{\lambda_{\max}}'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: tasa
    funciones: [girada]
    tasas: [0.05, 0.3, 0.41]
    inicio: [-2, 1]
referencias:
  - clave: goodfellow
    capitulo: '8.3'
  - clave: boyd
    capitulo: '9.3'
publicado: true
---

## Intuición

Al bajar una ladera con pasos de un largo fijo, el largo importa. Con pasos de hormiga se llega, pero tarda una eternidad. Con zancadas enormes se cruza el fondo del valle y se cae en la ladera de enfrente, más arriba de donde se estaba; si cada zancada es más larga que la anterior, uno termina cada vez más lejos.

La tasa de aprendizaje es ese largo de paso. Su valor seguro depende de qué tan curvado está el terreno: donde la función se curva mucho, un paso corto ya basta para cruzar el fondo. En una cuadrática se puede calcular exactamente: el método es estable si la tasa es menor que $2/\lambda_{\max}$, donde $\lambda_{\max}$ es la mayor curvatura. Elegirla bien es una de las decisiones más importantes al entrenar un modelo, y por eso existen calendarios que la reducen con el tiempo y métodos que la adaptan solos.

## Definición

En el descenso de gradiente $\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k)$, el número $\eta > 0$ es la **tasa de aprendizaje**.

:::teorema[Estabilidad en una cuadrática]
Para $f(\mathbf{x}) = \tfrac{1}{2}(\mathbf{x} - \mathbf{x}^*)^\top \mathbf{A}(\mathbf{x} - \mathbf{x}^*)$ con $\mathbf{A} \succ 0$ de valores propios $\lambda_{\min} \le \dots \le \lambda_{\max}$, el error en la dirección del vector propio $i$ se multiplica en cada paso por $1 - \eta\lambda_i$. El método converge si y solo si
$$
0 < \eta < \frac{2}{\lambda_{\max}},
$$
y la tasa que minimiza el peor factor es $\eta^* = \dfrac{2}{\lambda_{\min} + \lambda_{\max}}$.
:::

Si $\eta > 1/\lambda_i$ el factor es negativo y esa componente oscila de signo; si $\eta > 2/\lambda_i$, su valor absoluto supera 1 y crece.

:::nota[Qué significa cada símbolo]
- $\eta$: tasa de aprendizaje.
- $\mathbf{x}^*$: mínimo de la cuadrática.
- $\mathbf{A}$: hessiana de la cuadrática, definida positiva.
- $\lambda_i$: valores propios de $\mathbf{A}$; $\lambda_{\min}$ y $\lambda_{\max}$: el menor y el mayor.
- $1 - \eta\lambda_i$: factor por el que se multiplica el error en cada paso.
- $\eta^*$: tasa óptima para el peor caso.
:::

## Cómo usar la visualización

El mismo descenso de gradiente corre con varias tasas a la vez. A la izquierda se ven los caminos sobre las curvas de nivel; a la derecha, la distancia al mínimo, $f(\mathbf{x}_k) - f^*$, en escala logarítmica según la iteración. El encabezado recuerda el umbral $2/\lambda_{\max}$ y da el error de cada tasa en la iteración actual.

En la escala logarítmica, la convergencia aparece como una recta que baja: más inclinada cuanto más rápida. Una tasa por encima del umbral produce una recta que sube y un camino que rebota cada vez más lejos del mínimo.

## Ejemplo

Para $f(x, y) = \tfrac{1}{2}(x^2 + 10y^2)$, con valores propios 1 y 10, se comparan tres tasas desde $(3, 1.5)$.

1. Umbral: $2/\lambda_{\max} = 2/10 = 0.2$.
2. Con $\eta = 0.02$: factores $1 - 0.02 = 0.98$ en $x$ y $1 - 0.2 = 0.8$ en $y$. Converge, pero en $x$ el error solo baja 2 % por paso.
3. Con $\eta = 0.15$: factores $0.85$ y $1 - 1.5 = -0.5$. Converge mucho más rápido; $y$ cambia de signo en cada paso.
4. Con $\eta = 0.205$: factores $0.795$ y $1 - 2.05 = -1.05$. La componente $y$ crece 5 % por paso: tras 20 pasos, $|y| = 1.5 \cdot 1.05^{20} = 3.98$, y el método diverge.
5. La tasa óptima es $\eta^* = 2/(1 + 10) = 0.1818$, con factor $0.818$ en ambas direcciones.

:::figura[Las tres tasas del ejemplo sobre ½(x² + 10y²): η = 0.02 avanza despacio, η = 0.15 converge rápido con zigzag y η = 0.205, por encima de 2/λmax = 0.2, rebota cada vez más lejos y su error crece.]{componente="OptimizerRace"}
```yaml
modo: tasa
funciones: [cuadratica]
tasas: [0.02, 0.15, 0.205]
inicio: [3, 1.5]
```
:::

## Propiedades

- **Tasa óptima:** $\eta^* = 2/(\lambda_{\min} + \lambda_{\max})$ iguala los factores extremos en valor absoluto, $\dfrac{\kappa - 1}{\kappa + 1}$, con $\kappa = \lambda_{\max}/\lambda_{\min}$.
- **Funciones no cuadráticas:** la curvatura cambia de un lugar a otro; una tasa estable cerca del mínimo puede no serlo lejos.
- **Calendarios:** reducir $\eta$ con el tiempo, por ejemplo $\eta_k = \eta_0/(1 + k/T)$, combina avance inicial rápido con estabilidad final.
- **Métodos adaptativos:** AdaGrad, RMSProp y Adam ajustan una tasa por coordenada según la magnitud de los gradientes recientes.
- **Búsqueda lineal:** en lugar de fijar $\eta$, se elige en cada paso con una regla como la de Armijo.

:::figura[La tasa óptima η* = 2/11 = 0.1818 frente a η = 0.1: con η* el error baja por el factor 0.818 en ambas direcciones; con 0.1, el factor en x es 0.9 y la convergencia es más lenta.]{componente="OptimizerRace"}
```yaml
modo: tasa
funciones: [cuadratica]
tasas: [0.1, 0.1818]
inicio: [3, 1.5]
```
:::

## Errores comunes

- **Creer que una tasa mayor siempre es más rápida.** Por encima de $1/\lambda_{\max}$ aparecen oscilaciones, y por encima de $2/\lambda_{\max}$ el método diverge.
- **Interpretar una pérdida que crece como falta de iteraciones.** Si la pérdida aumenta de forma sostenida, la tasa es demasiado grande.
- **Usar la misma tasa después de reescalar los datos.** Cambiar las unidades de las variables cambia la curvatura y el umbral de estabilidad.
- **Comparar tasas con una sola semilla o un solo punto inicial.** La diferencia puede deberse al inicio, no a la tasa.

:::figura[En ½(x² + y²), con curvatura 1: η = 0.5 converge, η = 1 llega en un solo paso, η = 1.9 oscila pero converge despacio y η = 2.1 diverge, aunque es la tasa más grande.]{componente="OptimizerRace"}
```yaml
modo: tasa
funciones: [redonda]
tasas: [0.5, 1, 1.9, 2.1]
inicio: [2.5, 2]
```
:::

## Conexiones

Es el parámetro central del [[descenso-de-gradiente]]; su valor seguro depende de los [[valores-y-vectores-propios]] de la [[matriz-hessiana]] y del [[numero-de-condicion]]. La [[busqueda-lineal]] la elige automáticamente en cada paso, y en la [[optimizacion-estocastica]] se combina con calendarios y métodos adaptativos. El [[metodo-de-newton]] evita elegirla usando la curvatura de forma explícita.

## Formulario

:::formula[Condición de estabilidad]
$$
0 < \eta < \frac{2}{\lambda_{\max}}
$$

- $\eta$: tasa; $\lambda_{\max}$: mayor valor propio de la hessiana.
:::

:::formula[Factor por dirección propia]
$$
z_{k+1, i} = (1 - \eta\lambda_i)\,z_{k, i}
$$

- $z_{k, i}$: error en la dirección del vector propio $i$; $\lambda_i$: su valor propio.
:::

:::formula[Tasa óptima]
$$
\eta^* = \frac{2}{\lambda_{\min} + \lambda_{\max}}, \qquad \text{factor} = \frac{\kappa - 1}{\kappa + 1}
$$

- $\kappa = \lambda_{\max}/\lambda_{\min}$: número de condición.
:::

:::formula[Calendario de decaimiento]
$$
\eta_k = \frac{\eta_0}{1 + k/T}
$$

- $\eta_0$: tasa inicial; $T$: número de iteraciones en el que la tasa se reduce a la mitad.
:::
